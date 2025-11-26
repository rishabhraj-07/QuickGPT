import groqSpeechToText from "../utils/SpeechTotext.js";

export const convertSpeech = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No audio file provided" });
    }
    const audioUrl = req.file.path;

    const text = await groqSpeechToText(audioUrl);

    //fs.unlinkSync(audioUrl);
    res.status(200).json({ success: true, text, audioUrl });
  } catch (error) {
    console.log("Groq STT Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Speech conversion failed" });
  }
};
