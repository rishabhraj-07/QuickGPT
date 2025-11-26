import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const playVoice = async (text) => {
  const response = await axios.post(
    `${backendUrl}/api/tts/text-to-speech`,
    { text }, // GPT text goes here
    { responseType: "blob" } // binary audio
  );

  const audioURL = URL.createObjectURL(response.data);
  new Audio(audioURL).play(); // plays audio in browser
};
