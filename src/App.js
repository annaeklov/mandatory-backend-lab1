import React, { useState } from "react";
import io from "socket.io-client";
import "./App.css";

import Header from "./components/header.js";
import Login from "./components/login.js";
import Chatview from "./components/chatview.js";

// Make connection
const socket = io("http://localhost:8080");

export default function App() {
  const [username, setUsername] = useState("Anna");
  const [inputValue, setInputValue] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (inputValue.trim().length === 0) {
      setInputValue("");
      return;
    }
    setUsername(inputValue);
  }

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleLogout() {
    setUsername("");
    setInputValue("");
  }

  let login = (
    <Login
      handleChange={handleChange}
      handleLogin={handleLogin}
      inputValue={inputValue}
    />
  );

  let chatview = (
    <Chatview socket={socket} username={username} handleLogout={handleLogout} />
  );

  return (
    <div className="App">
      <Header />
      {username ? chatview : login}
    </div>
  );
}
