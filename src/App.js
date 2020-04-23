import React, { useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";

function App() {
  useEffect(() => {
    axios("/users").then((res) => {
      console.log(res);
    });
  }, []);

  return <div className="App"><h1>MY CHAT APP</h1></div>;
}

export default App;
