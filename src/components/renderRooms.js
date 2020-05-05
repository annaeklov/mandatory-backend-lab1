import React, { useState } from "react";
import axios from "axios";
import RenderOneRoom from "./renderOneRoom";

export default function RenderRooms({ rooms, socket, username, updateRooms }) {
  const [choosedRoom, setChoosedRoom] = useState({});
  const [createdRoom, setCreatedRoom] = useState("");

  function chooseRoom(room) {
    console.log("Choosed a room", room._id, room.messages);
    setChoosedRoom(room);
  }

  function handleChangeCreateRoom(e) {
    setCreatedRoom(e.target.value);
    console.log(createdRoom);
  }

  function postCreatedRoom(e) {
    e.preventDefault();

      if (createdRoom.trim().length === 0) {
      setCreatedRoom("");
      return;
    }
    axios
      .post("/rooms", { data: createdRoom })
      .then((res) => {
        console.log(createdRoom);
        updateRooms();
        setCreatedRoom("");
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
        setChoosedRoom("");
      })
      .catch((err) => {
        console.log("Error från frontend-delete", err);
      });
  }

  const mappedRooms = rooms.map((room) => {
    return (
      <li key={room._id}>
        <span
          onClick={() => {
            chooseRoom(room);
          }}
        >
          {room.roomName}
        </span>
        {!room.isDefault && (
          <button
            className="deleteBtn"
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

  return (
    <div className="chatview__renderRooms">
      <div className="chatview__chooseRooms">
        <p>Choose a room:</p>
        <ul>{mappedRooms}</ul>
        <form className="chatview__createRoom">
          <p>Or create a new room:</p>

          <input
            className="createRoom__form-inputField"
            type="text"
            placeholder="Room name here"
            autoFocus
            onChange={handleChangeCreateRoom}
            value={createdRoom}
          />
          <button className="createRoom__form-btn" onClick={postCreatedRoom}>
            Create room
          </button>
        </form>
      </div>
      <RenderOneRoom
        username={username}
        choosedRoomID={choosedRoom._id}
        socket={socket}
      />
    </div>
  );
}
