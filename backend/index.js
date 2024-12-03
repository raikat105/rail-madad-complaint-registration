import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import complaintRoute from "./routes/complaint.route.js";
import https from "https";
import OpenAI from "openai";
import multer from "multer";
import bodyParser from "body-parser";
import fs from "fs";

const upload = multer();

import cors from "cors";
const app = express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URI;

//middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// DB Code
try {
	mongoose.connect(MONGO_URL);
	console.log("Conntected to MongoDB");
} catch (error) {
	console.log(error);
}

// defining routes
app.use("/api/users", userRoute);
app.use("/api/complaint", complaintRoute);
app.use(fileUpload({ useTempFiles: true }));

// Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_SECRET_KEY,
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.post("/pnr-status", (req, res) => {
	const { pnr } = req.body;

	// Validate PNR number
	if (!pnr || pnr.length !== 10 || isNaN(pnr)) {
		return res
			.status(400)
			.json({ status: "error", message: "Invalid PNR number." });
	}

	// Options for HTTPS request
	const options = {
		method: "GET",
		hostname: "irctc-indian-railway-pnr-status.p.rapidapi.com",
		path: `/getPNRStatus/${pnr}`,
		headers: {
			"x-rapidapi-key": process.env.RAPIDAPI_KEY, // Use environment variable for the API key
			"x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com",
		},
	};

	// Make the API request
	const apiReq = https.request(options, (apiRes) => {
		let data = "";

		// Collect data chunks
		apiRes.on("data", (chunk) => {
			data += chunk;
		});

		// Process the complete response
		apiRes.on("end", () => {
			try {
				const parsedBody = JSON.parse(data);

				if (parsedBody.error) {
					return res.status(500).json({
						status: "error",
						message: "Unable to fetch PNR status.",
						errorDetails: parsedBody.error,
					});
				}
				console.log(parsedBody);

				res.json({
					status: "success",
					pnrDetails: parsedBody,
				});
			} catch (err) {
				// Handle JSON parsing errors
				console.error("Error parsing API response:", err.message);
				return res.status(500).json({
					status: "error",
					message: "Failed to process PNR response.",
				});
			}
		});
	});

	// Handle request errors
	apiReq.on("error", (err) => {
		console.error("Request error:", err.message);
		res
			.status(500)
			.json({ status: "error", message: "Failed to connect to RapidAPI." });
	});

	// End the request
	apiReq.end();
});

app.post("/train-status", (req, res) => {
	const { trainNumber } = req.body;
	console.log(trainNumber);
	if (!trainNumber || trainNumber.length !== 5) {
		return res
			.status(400)
			.json({ status: "error", message: "Invalid Train number." });
	}

	const today = new Date();
	const formattedDate = `${today.getFullYear()}${
		today.getMonth() + 1
	}${today.getDate()}`;

	const options = {
		method: "GET",
		hostname: "indian-railway-irctc.p.rapidapi.com",
		port: null,
		path: `/api/trains/v1/train/status?departure_date=${formattedDate}&isH5=true&client=web&train_number=${trainNumber}`,
		headers: {
			"x-rapidapi-key": "14497601b1mshd129f732e915c72p104366jsn916ae8ff0c31",
			"x-rapidapi-host": "indian-railway-irctc.p.rapidapi.com",
			"x-rapid-api": "rapid-api-database",
		},
	};

	const apiReq = https.request(options, function (apiRes) {
		const chunks = [];

		apiRes.on("data", function (chunk) {
			chunks.push(chunk);
		});

		apiRes.on("end", function () {
			const body = Buffer.concat(chunks);
			console.log(body.toString());

			const parsedBody = JSON.parse(body);

			if (parsedBody.error) {
				return res
					.status(500)
					.json({ status: "error", message: "Unable to fetch PNR status." });
			}

			res.json({
				status: "success",
				trainDetails: parsedBody,
			});
		});
	});

	apiReq.on("error", (err) => {
		console.error(err);
		res
			.status(500)
			.json({ status: "error", message: "Failed to connect with API." });
	});

	apiReq.end();
});

upload.none();

app.post("/chat", async (req, res) => {
	try {
	  // Log the incoming request body
	  console.log(req.body);

	  const { text, chatHistory } = req.body;

	  const openai = new OpenAI({ apiKey: process.env.API_KEY });
	  if (!process.env.API_KEY) {
		throw new Error("API_KEY is missing. Check your environment variables.");
	  }

	  // Construct the prompt
	  const prompt =
		"You are the helpline of the IRCTC of Indian Railways and you are sitting behind RailMadad platform to help and assist people through a chatbot. You have to help them accordingly and give valid solutions to their problems just like a railway helpline would give. The chat history of the user and your chatbot is: \n" +
		chatHistory +
		"\nAnd now their new query or line is: " +
		text +
		"\nAnswer accordingly, just like a station helpline would do. Keep it brief and simple. And your answer shouldn't start with 'Chatbot:'. It should be normal.";
  
	  // Call OpenAI's API
	  const response = await openai.chat.completions.create({
		model: "gpt-4", // Use the correct model name
		messages: [
		  {
			role: "user",
			content: prompt,
		  },
		],
	  });

	  // Log and send the response
	  console.log(response.choices[0].message);
	  res.json({ text: response.choices[0].message.content });
	} catch (error) {
	  // Log and send errors
	  console.error("Error occurred:", error.message);
	  res.status(500).json({ error: "Internal Server Error", text: error.message });
	}
  });