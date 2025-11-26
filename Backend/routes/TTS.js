import express from "express";
import groqTextToSpeech from "../controllers/TextToSpeech.js";

const router = express.Router();

router.post("/text-to-speech", groqTextToSpeech);

export default router;
