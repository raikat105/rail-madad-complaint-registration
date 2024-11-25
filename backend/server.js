import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// PNR Status Endpoint
app.post("/pnr-status", (req, res) => {
	const { pnr } = req.body;
	console.log(pnr);
	if (!pnr || pnr.length !== 10) {
		return res
			.status(400)
			.json({ status: "error", message: "Invalid PNR number." });
	}
	console.log(pnr);
	const options = {
		method: "GET",
		hostname: "irctc-indian-railway-pnr-status.p.rapidapi.com",
		port: null,
		path: `/getPNRStatus/${pnr}`,
		headers: {
			"x-rapidapi-key": "14497601b1mshd129f732e915c72p104366jsn916ae8ff0c31", // Replace with your RapidAPI key
			"x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com",
		},
	};

	const apiReq = http.request(options, (apiRes) => {
		const chunks = [];

		apiRes.on("data", (chunk) => {
			chunks.push(chunk);
		});

		apiRes.on("end", () => {
			const body = Buffer.concat(chunks).toString();
			console.log(body);
			const parsedBody = JSON.parse(body);

			if (parsedBody.error) {
				return res
					.status(500)
					.json({ status: "error", message: "Unable to fetch PNR status." });
			}

			res.json({
				status: "success",
				pnrDetails: parsedBody,
			});
		});
	});

	apiReq.on("error", (err) => {
		console.error(err);
		res
			.status(500)
			.json({ status: "error", message: "Failed to connect to RapidAPI." });
	});

	apiReq.end();
});

app.post("/train-status", (req, res) => {
	const { trainNumber } = req.body;
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

	const apiReq = http.request(options, function (apiRes) {
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

app.post("/chat", (req, res) => {
	const yes = async () => {
		const genAI = new GoogleGenerativeAI(process.env.API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt =
			"You are the helpline of the IRCTC of Indian Railways and you are sitting behind RailMadad platform to help and assist people through a chatbot. You have to help them accordingly and give valid solutions to their problems just like a railway helpline would give. Their next command is : " +
			req.body.message +
			"  \nAnswer Accordingly, just like a station helpline would do. Keep it kind of short. if the person asks for PNR, tell him to use IRCTC's website or RailMadad's PNR Status enquiry part. If he asks for Live Train Running Status, do the same again. Read IRCTC docs and give general enquiry details in brief as per the question.";

		const result = await model.generateContent(prompt);
		console.log(result.response.text());

		res.json({ text: result.response.text() });
	};
	yes();
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
