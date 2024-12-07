import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = "This is a RailMadad Complaint Resolution Feedback Model. The feedback " + "The staff behaviour was quite good, even though the work was decent." + " has been entered by the user. Classify it as Positive, Negative or Neutral. Reply only one of the three things.";

		const result = await model.generateContent(prompt);
        console.log(result.response.text())