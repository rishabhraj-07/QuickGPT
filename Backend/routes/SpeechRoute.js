import express from "express";
import upload from "../middleware/multer.js";
import { convertSpeech } from "../controllers/SpeechController.js";

const router = express.Router();

router.post("/convert-speech", upload.single("audio"), convertSpeech);

export default router;
