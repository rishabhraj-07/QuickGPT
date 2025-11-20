import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./VoiceSpeech.css";

const VoiceSpeech = ({ onText }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    // If microphone is blocked or browser does not support it
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.warn("Browser does not support speech recognition.");
      return;
    }

    // When listening stops and transcript exists → send text
    if (!listening && transcript.trim().length > 0) {
      onText(transcript.trim());
      resetTranscript();
    }
  }, [listening, transcript]);

  const startListening = async () => {
    resetTranscript();

    try {
      // Check mic permission before starting
      await navigator.mediaDevices.getUserMedia({ audio: true });

      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    } catch (error) {
      console.error("Microphone permission denied:", error);
      alert(
        "Microphone access blocked. Please allow microphone for this website."
      );
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <p style={{ color: "red" }}>Your browser does not support voice input.</p>
    );
  }

  return (
    <button
      onClick={!listening ? startListening : stopListening}
      className="mic-btn"
    >
      {!listening ? (
        <i className="fa-solid fa-microphone"></i>
      ) : (
        <i className="fa-solid fa-circle-stop"></i>
      )}
    </button>
  );
};

export default VoiceSpeech;
