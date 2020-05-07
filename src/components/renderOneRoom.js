import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Emojify from "react-emojione";

export default function RenderOneRoom({ choosedRoomID, socket, username }) {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [choosedRoom, setChoosedRoom] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTo(0, messagesEndRef.current.scrollHeight);
  };

  useEffect(() => {
    if (choosedRoomID === undefined) return;
    axios
      .get("/rooms/" + choosedRoomID)
      .then((res) => {
        setChoosedRoom(res.data[0]);
        scrollToBottom();
      })
      .catch((err) => {
        console.log("Error", err);
      });
    return () => {};
  }, [choosedRoomID, newMessage]);

  socket.on("new message", (data) => {
    setNewMessage(data);
  });

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
      username: username,
      message: message,
      roomId: choosedRoom._id,
    });
    setMessage("");
  }

  const mappedMessages =
    choosedRoom.roomName &&
    choosedRoom.messages.map((info, idx) => {
      return (
        <div key={idx} className="innerView__message">
          <Emojify>
            <p className="innerView__message-username">
              <strong>{info.username}:</strong>
            </p>
            <p className="innerView__message-message">{info.message}</p>
          </Emojify>
        </div>
      );
    });

  return (
    <>
      {choosedRoomID && (
        <div className="chatview__inner">
          <p>
            You are in room: <strong>{choosedRoom.roomName}</strong>
          </p>
          <div className="chatview__msgShow" ref={messagesEndRef}>
            {mappedMessages}
          </div>
          <form className="sendMsg__form">
            <textarea
              type="text"
              placeholder="Type your message here"
              autoFocus
              onChange={handleChange}
              value={message}
            />
            <button className="sendMsg__form-btn" onClick={sendMessage}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
