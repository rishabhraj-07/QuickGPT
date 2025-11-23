import fs from "fs";
import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const groqSpeechToText = async (filePath) => {
  try {
    const res = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3", // Groq Whisper Model
      response_format: "json",
    });

    if (res && res.text) {
      return res.text;
    } else {
      throw new Error("No transcription text returned from Groq API");
    }
  } catch (err) {
    console.error("Error reading audio file:", err);
  }
};

export default groqSpeechToText;
