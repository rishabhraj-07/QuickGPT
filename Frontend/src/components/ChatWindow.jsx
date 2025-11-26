import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../context/MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import VoiceSpeech from "./VoiceSpeech.jsx";
import { playVoice } from "./PlayAudio.jsx";

const ChatWindow = () => {
  const {
    promt,
    setPromt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    user,
    credits,
    setCredits,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFromVoice, setIsFromVoice] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const getReply = async (message = promt) => {
    if (!message.trim()) return;

    //Check for credits
    if (credits <= 0) {
      toast.error("No credits left. Please upgrade your plan.");
      return;
    }

    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, threadId: currThreadId }),
    };

    try {
      const response = await fetch(`${backendUrl}/api/chat`, options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);

      if (isFromVoice) {
        await playVoice(res.reply); // Only speak when input was voice
      }

      if (res.credits !== undefined) {
        setCredits(res.credits); // Update credits
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //append new chat to prevChats
  useEffect(() => {
    if (promt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: promt },
        { role: "assistant", content: reply },
      ]);
    }

    setPromt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleVoiceClick = async (text) => {
    setPromt(text);
    setIsFromVoice(true);
    await getReply(text);
  };

  const handleLogout = async () => {
    const response = await fetch(`${backendUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      toast.success("Logged out successfully");
      navigate("/login");
    } else {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          QuickGPT <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user" onClick={handleProfileClick}></i>
          </span>
          <p className="username">{user?.username}</p>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem" onClick={() => navigate("/credits")}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </div>
        </div>
      )}

      <Chat />
      <ScaleLoader color="#fff" loading={loading} />
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={promt}
            onChange={(e) => setPromt(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && promt.trim()
                ? (setIsFromVoice(false), getReply(promt))
                : ""
            }
          ></input>
          <div className="inputIcons">
            {/*  Mic only visible when no text */}
            {!promt.trim() && (
              <div className="micIcon">
                <VoiceSpeech onText={handleVoiceClick} />
              </div>
            )}

            {/*  Send icon when text exists */}
            {promt.trim() && (
              <div
                className="sendIcon"
                onClick={() => {
                  setIsFromVoice(false); // TTS disabled
                  getReply(promt);
                }}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </div>
            )}
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default ChatWindow;
