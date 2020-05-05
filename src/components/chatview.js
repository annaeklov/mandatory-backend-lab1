import React, { useEffect, useState } from "react";
import axios from "axios";

import RenderRooms from "./renderRooms.js";

export default function Chatview({ username, handleLogout, socket }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    updateRooms();
  }, []);

  function updateRooms() {
    axios
      .get("/rooms")
      .then((res) => {
        console.log("RES.DATA GET/rooms", res.data);
        setRooms(res.data);
      })
      .catch((e) => {
        console.log("Error från frontend", e);
      });
  }

  return (
    <main>
      <h1 className="chatview__title">Chatview</h1>
      <p>
        Hi <strong>{username}</strong>!
      </p>
      <RenderRooms
        rooms={rooms}
        socket={socket}
        username={username}
        updateRooms={updateRooms}
      />
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
