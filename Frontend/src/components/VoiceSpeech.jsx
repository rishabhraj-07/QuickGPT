import React, { useRef, useState } from "react";
import "./VoiceSpeech.css";

const VoiceSpeech = ({ onText }) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const startRecording = async () => {
    audioChunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = handleStop;

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("audio", audioBlob, "voiceInput.webm");

    try {
      const res = await fetch(
       `${backendUrl}/api/speech/convert-speech`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.text) {
        onText(data.text);
      }
    } catch (error) {
      console.error("Transcription error:", error);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className="mic-btn"
    >
      {!isRecording ? (
        <i className="fa-solid fa-microphone"></i>
      ) : (
        <i className="fa-solid fa-circle-stop"></i>
      )}
    </button>
  );
};

export default VoiceSpeech;
