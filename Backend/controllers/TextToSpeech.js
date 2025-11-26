import axios from "axios";
import "dotenv/config";

const groqTextToSpeech = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Text is required!" });

    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/speech",
      {
        model: "playai-tts",
        voice: "Arista-PlayAI",
        input: text,
        response_format: "mp3",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    res.set("Content-Type", "audio/mpeg");
    res.send(response.data);
  } catch (error) {
    const errorText = Buffer.from(error.response.data).toString();
    console.log("Groq TTS Error :", errorText);
    res.status(500).json({ message: "TTS failed", details: errorText });
  }
};

export default groqTextToSpeech;
