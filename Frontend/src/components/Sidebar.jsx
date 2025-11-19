import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "../context/MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import ThemeToggle from "./ThemeToggle.jsx";

const Sidebar = () => {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setPromt,
    setNewChat,
    setReply,
    setCurrThreadId,
    setPrevChats,
    credits,
  } = useContext(MyContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/thread`, {
        credentials: "include",
      });
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      //console.log(filteredData);
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPromt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(`${backendUrl}/api/thread/${newThreadId}`, {
        credentials: "include",
      });
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${backendUrl}/api/thread/${threadId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const res = await response.json();
      console.log(res);

      //update the thread list
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (currThreadId === threadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <div className="sidebar-header">
        <img
          src="src/assets/blacklogo.png"
          alt="gptLogo"
          className="logo"
        ></img>
        <div className="credits-badge" title="Available credits">
          <i className="fa-solid fa-coins"></i>
          <span>Credit Left : {credits}</span>
        </div>
      </div>

      <button onClick={createNewChat} className="new-chat-btn">
        <span className="newchat">
          <i class="fa-regular fa-pen-to-square"></i>New Chat
        </span>
      </button>

      <ul className="history">
        {allThreads.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => changeThread(thread.threadId)}
            className={currThreadId === thread.threadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="toggle">
        <ThemeToggle />
        <p>Change Theme</p>
      </div>
    </section>
  );
};

export default Sidebar;
