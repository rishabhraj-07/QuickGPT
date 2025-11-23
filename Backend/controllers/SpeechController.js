import groqSpeechToText from "../utils/SpeechTotext.js";
import fs from "fs";

export const convertSpeech = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No audio file provided" });
  }

  try {
    const filePath = req.file.path;

    const text = await groqSpeechToText(filePath);

    fs.unlinkSync(filePath);

    res.status(200).json({ success: true, text });
  } catch (error) {
    console.log("Groq STT Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Speech conversion failed" });
  }
};
