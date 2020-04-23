import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080");

export default function Chatview({ username, handleLogout }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios("/rooms").then((res) => {
      console.log(res);
    });
  }, []);

  function sendMessage(e) {
    e.preventDefault();

    if (message.trim().length === 0) {
      setMessage("");
      return;
    }

    socket.emit("send message", {
      username: username,
      message: message,
    });
    setMessage("");
    console.log("sent a message: ", message);
  }

  function handleChange(e) {
    console.log(e.target.value);
    setMessage(e.target.value);
  }

  return (
    <main>
      <h1 className="chatview__title">Chatview</h1>
      <p>
        Hi <strong>{username}</strong>!
      </p>
      <p>Room name: [room]</p>
      <form>
        <textarea
          type="text"
          placeholder="Type your message here"
          autoFocus
          onChange={handleChange}
          value={message}
        />
        <button onClick={sendMessage}>Send</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
