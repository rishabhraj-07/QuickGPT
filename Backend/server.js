import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/AuthRoutes.js";
import creditRoutes from "./routes/CreditRoutes.js";
import { stripeWebhook } from "./controllers/WebHook.js";

const app = express();
const PORT = 8000;

//Stripe Webhook
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/credit", creditRoutes);

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
