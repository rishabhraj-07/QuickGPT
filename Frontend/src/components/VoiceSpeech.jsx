import React, { useEffect, useContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./VoiceSpeech.css";

const VoiceSpeech = ({ onText }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      onText(transcript);
    }
  }, [listening]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Browser does not support speech recognition</p>;
  }

  return (
    <button
      onClick={!listening ? startListening : stopListening}
      className="mic-btn"
    >
      {!listening ? (
        <i class="fa-solid fa-microphone"></i>
      ) : (
        <i class="fa-solid fa-circle-stop"></i>
      )}
    </button>
  );
};

export default VoiceSpeech;
