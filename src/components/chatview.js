import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

export default function Chatview({ username, handleLogout, socket }) {
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [choosedRoom, setChoosedRoom] = useState({});

  useEffect(() => {
    axios("/rooms")
      .then((res) => {
        console.log("RES.DATA", res.data);
        setRooms(res.data);
      })
      .catch((e) => {
        console.log("error från frontend", e);
      });
  }, []);

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
    });
    setMessage("");
    console.log("sent a message: ", message);
  }

  /*  socket.on("new message", {
      username: username,
      message: message,
    }); */

  function chooseRoom(room) {
    console.log("clicked a room", room._id);
    setChoosedRoom(room);
  }

  const mappedRooms = rooms.map((room) => {
    return (
      <li key={room._id}>
        <a
          onClick={() => {
            chooseRoom(room);
          }}
        >
          {room.roomName}
        </a>
      </li>
    );
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
    <main>
      <h1 className="chatview__title">Chatview</h1>
      <p>
        Hi <strong>{username}</strong>!
      </p>
      <div className="chatview__chooseRooms">
        <p>Choose room:</p>
        <ul>{mappedRooms}</ul>
        <button className="chatview__chooseRooms-button">
          Create new room
        </button>
      </div>
      {choosedRoom.roomName && (
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

      <hr />
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}

/* const mappedMessages = rooms.map((messages) => {
    console.log(messages.messages)
     messages.map((msg) => {
      console.log(msg);
    }); 
  }); */
