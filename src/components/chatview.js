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
      <div className="chatview__top">
        <p>
          Hi <strong>{username}</strong>!
        </p>
      </div>
      <RenderRooms
        rooms={rooms}
        socket={socket}
        username={username}
        updateRooms={updateRooms}
      />
      <div className="logout__div">
      <button className="logout__btn" onClick={handleLogout}>Logout</button></div>
    </main>
  );
}
