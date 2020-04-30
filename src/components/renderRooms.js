import React, { useState } from "react";
import axios from "axios";

export default function RenderRooms({ rooms, socket, username, updateRooms }) {
  const [choosedRoom, setChoosedRoom] = useState({});
  const [message, setMessage] = useState("");
  const [createdRoom, setCreatedRoom] = useState("");

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

  function handleChangeCreateRoom(e) {
    setCreatedRoom(e.target.value);
    console.log(createdRoom);
  }

  function postCreatedRoom() {
    axios
      .post("/rooms", { data: createdRoom })
      .then((res) => {
        console.log(createdRoom);
      })
      .catch((err) => {
        console.log("Error från frontend-post", err);
      });
  }

  function deleteRoom(room) {
    axios
      .delete("/rooms/" + room._id)
      .then((res) => {
        updateRooms();
      })
      .catch((err) => {
        console.log("Error från frontend-delete", err);
      });
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
        {!room.isDefault && (
          <button
            onClick={() => {
              deleteRoom(room);
            }}
          >
            X
          </button>
        )}
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
    <div className="renderRooms">
      <div className="chatview__chooseRooms">
        <p>Choose a room:</p>
        <ul>{mappedRooms}</ul>
        <p>Or create a new room:</p>
        <form>
          <input
            type="text"
            placeholder="Room name here"
            autoFocus
            onChange={handleChangeCreateRoom}
            value={createdRoom}
          />
          <br />
          <button onClick={postCreatedRoom}>Create room</button>
        </form>
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
    </div>
  );
}
