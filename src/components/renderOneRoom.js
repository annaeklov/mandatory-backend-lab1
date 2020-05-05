import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RenderOneRoom({ choosedRoomID, socket, username }) {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [choosedRoom, setChoosedRoom] = useState("");

  useEffect(() => {
    if (choosedRoomID === undefined) return;
    axios
      .get("/rooms/" + choosedRoomID)
      .then((res) => {
        setChoosedRoom(res.data[0]);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, [choosedRoomID, newMessage]);

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function sendMessage(e) {
    e.preventDefault();

    if (message.trim().length === 0) {
      setMessage("");
      return;
    }

    socket.emit("send message", {
      // =data i servern
      username: username,
      message: message,
      roomId: choosedRoom._id,
    });
    setMessage("");
  }

  socket.on("new message", (data) => {
    setNewMessage(data);
  });

  const mappedMessages =
    choosedRoom.roomName &&
    choosedRoom.messages.map((info, idx) => {
      return (
        <div key={idx} className="innerView__message">
          <p>
            <strong>{info.username}:</strong>
          </p>
          <p>{info.message}</p>
        </div>
      );
    });

  return (
    <>
      {choosedRoomID && (
        <div>
          <p>
            You are in room: <strong>{choosedRoom.roomName}</strong>
          </p>
          <form>
            <textarea
              type="text"
              placeholder="Type your message here"
              autoFocus
              onChange={handleChange}
              value={message}
            />
            <br />
            <button onClick={sendMessage}>Send</button>
          </form>
          <div className="chatview__inner">{mappedMessages}</div>
        </div>
      )}
    </>
  );
}
