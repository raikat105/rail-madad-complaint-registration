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
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Feedback } from "./models/Feedback.model.js";
import { sendEmail } from "./middleware/emailService.js";
import Groq from "groq-sdk/index.mjs";

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
        // Initialize the GoogleGenerativeAI class with the API key
		console.log(req.body);
		const openai = new OpenAI({
			apiKey: "xai-CNNloo5h3hopo69hEZcasNFaK6aLuLe7bZIkvoV4jOvEi5e7nxGKbdOwzvZ7B8w1F6mirXrnuil2IQbY",
			baseURL: "https://api.x.ai/v1",
		  });

		  const promptRuleSet = {
			PassengerSafety: {
			  Immediate: [
				"Accidents",
				"Fires",
				"Derailments",
				"Any situation that endangers lives"
			  ],
			  Later: [
				"Potential safety hazards (e.g., cracked seats, missing emergency instructions)"
			  ]
			},
			OperationalImpact: {
			  Immediate: [
				"Signal failures",
				"Train delays",
				"Disruption of services that affect schedules or passenger journeys"
			  ],
			  Later: [
				"Minor delays",
				"Grievances about operational inefficiencies"
			  ]
			},
			HygieneAndCleanliness: {
			  Immediate: [
				"Overflowing toilets",
				"Pest infestations",
				"Unhygienic pantry conditions leading to health risks"
			  ],
			  Later: [
				"General untidiness",
				"Sporadic lapses in cleaning"
			  ]
			},
			PassengerComfort: {
			  Immediate: [
				"Broken air-conditioning",
				"Broken heating",
				"Lighting issues in reserved compartments"
			  ],
			  Later: [
				"Seat discomfort",
				"Minor noise disturbances",
				"Availability of blankets in AC coaches"
			  ]
			},
			TicketingAndReservation: {
			  Immediate: [
				"Duplicate seat allocations",
				"E-ticket failures",
				"Critical booking errors"
			  ],
			  Later: [
				"Complaints about pricing",
				"Waitlist updates"
			  ]
			},
			GrievancesAgainstStaff: {
			  Immediate: [
				"Harassment",
				"Abuse",
				"Misconduct by railway staff"
			  ],
			  Later: [
				"Rudeness",
				"Inefficiency not posing immediate harm"
			  ]
			},
			DepartmentsResponsibleForAddressingIssues: {
			  Safety: {
				Departments: [
				  "Railway Protection Force (RPF)",
				  "Safety Directorate"
				],
				Responsibilities: [
				  "Ensuring passenger safety",
				  "Investigating incidents",
				  "Responding to emergencies"
				]
			  },
			  Operations: {
				Departments: ["Operations Department"],
				Responsibilities: [
				  "Managing train schedules",
				  "Signal systems",
				  "Traffic coordination"
				]
			  },
			  Engineering: {
				Departments: ["Civil Engineering Department"],
				Responsibilities: [
				  "Maintenance of tracks",
				  "Maintenance of bridges",
				  "Maintenance of station infrastructure"
				]
			  },
			  ElectricalAndMechanicalMaintenance: {
				Departments: ["Electrical and Mechanical Engineering Department"],
				Responsibilities: [
				  "Upkeep of train equipment (air-conditioning, lighting, engines)"
				]
			  },
			  HygieneAndSanitation: {
				Departments: ["Environment & Housekeeping Management (E&HM)"],
				Responsibilities: [
				  "Cleaning of coaches",
				  "Cleaning of platforms",
				  "Cleaning of stations"
				]
			  },
			  CommercialServices: {
				Departments: ["Commercial Department"],
				Responsibilities: [
				  "Addressing ticketing issues",
				  "Passenger amenities",
				  "Catering complaints"
				]
			  },
			  SignalingAndCommunication: {
				Departments: ["Signal and Telecommunications Department"],
				Responsibilities: [
				  "Maintenance of signaling equipment",
				  "Wi-Fi services",
				  "Communication systems"
				]
			  },
			  GrievanceRedressal: {
				Departments: ["Public Grievance Department"],
				Responsibilities: [
				  "Centralized handling of passenger complaints via RailMadad or helpline services"
				]
			  },
			  CateringAndOnboardServices: {
				Departments: ["Indian Railway Catering and Tourism Corporation (IRCTC)"],
				Responsibilities: [
				  "Handling food and beverage-related complaints"
				]
			  }
			}
		  };
		  

        const { text, chatHistory } = req.body;

        if (!process.env.GROK_API_KEY) {
            throw new Error("API_KEY is missing. Check your environment variables.");
        }

        // Construct the prompt
        const prompt =
            "You are the helpline of the IRCTC of Indian Railways and you are sitting behind RailMadad platform to help and assist people through a chatbot. You have to help them accordingly and give valid solutions to their problems just like a railway helpline would give. \nAnswer accordingly, just like a station helpline would do. Keep it brief and simple. And your answer shouldn't start with 'Chatbot:'. It should be normal. Give a brief and minimilistic reply. Dont answer to anything that is not related to Railways. The chat history of the user and your chatbot is: \n" +
            chatHistory + "You have to categorize the complaint given by users into their relevant departmant from the set of rules provided below : /n" + promptRuleSet + "Also show the priority and get the PNR details of the user if not mentioned. Now, print the entire thing together in key fields like 'Complaint', 'Complaint Type', 'Department', 'Priority', 'PNR', 'Train Details' (if given). ask everything and then display the fields please.";

        // Call the Gemini model to generate the response
		const completion = await openai.chat.completions.create({
			model: "grok-beta",
			messages: [
			  { role: "system", content: prompt },
			  {
				role: "user",
				content: text,
			  },
			],
		  });
        //const result = await model.generateContent(prompt);
        console.log(completion.choices[0].message)

        // Send the response back
        res.json({ text: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: "Internal Server Error", text: error.message });
    }
});



//   Feed API

mongoose
	.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.error("Error connecting to MongoDB:", err));

// Sentiment Analysis Function
const determineSentiment = (rating) => {
	if (rating >= 4) return "positive";
	if (rating === 3) return "neutral";
	return "negative";
};

// Feedback Submission Route
app.post("/api/feedback", async (req, res) => {
	try {
		console.log(req.body);
		const { rating, feedback, sentiment } = req.body;
		const newFeedback = new Feedback({
			rating,
			feedback,
			sentiment,
		});

		console.log("Feedback to save:", newFeedback);
		await newFeedback.save();
		res
			.status(200)
			.json({ message: "Feedback submitted successfully", sentiment });
	} catch (error) {
		res.status(400).json({ error: "Failed to submit feedback" });
	}
});

app.post("/sentiment", async (req, res) => {
	try {
		console.log(req.body);
		const { feedback } = req.body;

		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt =
			"This is a RailMadad Complaint Resolution Feedback Model. The feedback " +
			feedback +
			" has been entered by the user. Classify it as Positive, Negative or Neutral. Reply only one of the three things.";

		const result = await model.generateContent(prompt);
		console.log(result.response.text());
		res.json({ text: result.response.text() });
	} catch (error) {
		console.error("Error occurred:", error.message);
		res
			.status(500)
			.json({ error: "Internal Server Error", text: error.message });
	}
});

// Email

app.post("/api/send-email", async (req, res) => {
	const { email, complaintId, description, phoneNumber, pnrNumber } = req.body;

	// Compose the email content
	const emailText = `
	  Dear User,
  
	  Your complaint has been successfully submitted with the following details:
  
	  Complaint ID: ${complaintId}
	  Phone Number: ${phoneNumber}
	  PNR Number: ${pnrNumber}
	  Description: ${description}
  
	  Please save your Complaint ID for future reference.
  
	  Regards,
	  Support Team
	`;

	try {
		await sendEmail(email, "Complaint Submission Confirmation", emailText);
		res.status(200).send({ message: "Email sent successfully!" });
	} catch (error) {
		res.status(500).send({ message: "Failed to send email.", error });
	}
});

const pnrDatabase = {
	1234567890: { trainNumber: "12345", coachNumber: "S1", seatNumber: "23" },
	9876543210: { trainNumber: "54321", coachNumber: "A1", seatNumber: "12" },
	1122334455: { trainNumber: "67890", coachNumber: "B2", seatNumber: "34" },
	2233445566: { trainNumber: "23456", coachNumber: "C3", seatNumber: "7" },
	3344556677: { trainNumber: "34567", coachNumber: "D4", seatNumber: "15" },
	4455667788: { trainNumber: "45678", coachNumber: "S2", seatNumber: "29" },
	5566778899: { trainNumber: "56789", coachNumber: "B1", seatNumber: "10" },
	6677889900: { trainNumber: "67891", coachNumber: "E5", seatNumber: "5" },
	7788990011: { trainNumber: "78901", coachNumber: "F6", seatNumber: "8" },
	8899001122: { trainNumber: "89012", coachNumber: "G7", seatNumber: "3" },
};


// API route to fetch PNR details
// API route to fetch PNR details
app.get("/getPnrDetails", (req, res) => {
	const pnr = req.query.pnr;

	if (!pnr) {
		return res.status(400).json({ error: "PNR not provided" });
	}

	const details = pnrDatabase[pnr];

	if (!details) {
		return res.status(404).json({ error: "PNR not found" });
	}

	res.json(details); // The response now includes trainNumber, coachNumber, and seatNumber
});

