import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

const Home = () => {
  return (
    <div className="app">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Home;
