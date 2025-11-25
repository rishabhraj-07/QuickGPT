import React, { useRef, useState } from "react";
import "./VoiceSpeech.css";
import CircularProgress from "@mui/material/CircularProgress";

const VoiceSpeech = ({ onText }) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("audio", audioBlob, "voiceInput.webm");

    try {
      const res = await fetch(`${backendUrl}/api/speech/convert-speech`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        onText(data.text);
      }
    } catch (error) {
      console.error("Transcription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className="mic-btn"
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress size={22} />
      ) : !isRecording ? (
        <i className="fa-solid fa-microphone"></i>
      ) : (
        <div className="recording-ui">
          <span className="listening-text">Listening...</span>
          <i className="fa-solid fa-circle-stop stop-icon"></i>
        </div>
      )}
    </button>
  );
};

export default VoiceSpeech;
