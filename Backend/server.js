import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/AuthRoutes.js";
import creditRoutes from "./routes/CreditRoutes.js";
import { stripeWebhook } from "./controllers/Webhook.js";
import SpeechRoute from "./routes/SpeechRoute.js";
import TextToSpeechRoute from "./routes/TTS.js";

const app = express();
const PORT = 8000;

//Stripe Webhook
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://quickgpt-frontend-la25.onrender.com",
      "https://quickgpt-iewy.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/speech", SpeechRoute);
app.use("/api/tts", TextToSpeechRoute);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
