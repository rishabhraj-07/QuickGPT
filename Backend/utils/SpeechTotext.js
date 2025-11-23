import FormData from "form-data";
import fetch from "node-fetch";
import "dotenv/config";

const groqSpeechToText = async (fileUrl) => {
  try {
    const formData = new FormData();
    formData.append("url", fileUrl);
    formData.append("model", "whisper-large-v3");

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (data && data.text) {
      return data.text;
    } else {
      throw new Error("Groq returned no text");
    }
  } catch (error) {
    console.error("Groq STT Error:", error);
    return "";
  }
};

export default groqSpeechToText;
