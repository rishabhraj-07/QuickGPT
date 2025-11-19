import { createContext, useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import axios from "axios";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [promt, setPromt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/verify`, {
          withCredentials: true,
        });
        setUser(res.data.user);
        if (res.data.user.credits !== undefined) {
          setCredits(res.data.user.credits);
        }
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <MyContext.Provider
      value={{
        promt,
        setPromt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        prevChats,
        setPrevChats,
        newChat,
        setNewChat,
        allThreads,
        setAllThreads,
        user,
        setUser,
        credits,
        setCredits,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
