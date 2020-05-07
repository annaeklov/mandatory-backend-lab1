const express = require("express");
const app = express();

// Socket.io med Express
const http = require("http").createServer(app);
const io = require("socket.io")(http, { origins: "*:*" });

app.use(express.json());

app.use(express.static("./build"));

// för att kunna använda funktioner i db.js
const MONGO_DB = require("./db");

/*-----------*/

app.get("/rooms", async (req, res) => {
  const data = await MONGO_DB.getAllRooms();
  if (data.length) {
    res.status(200).send(data);
  } else {
    res.status(400).end();
  }
});

app.get("/rooms/:id", async (req, res) => {
  let roomId = req.params.id;
  const data = await MONGO_DB.getOneRoom(roomId);
  if (data.length) {
    res.status(200).send(data);
  } else {
    res.status(400).end();
  }
});

app.post("/rooms", async (req, res) => {
  if (!req.body.data === String) {
    return res.status(400).end();
  }
  let newRoom = {
    roomName: req.body.data,
    messages: [],
    isDefault: false,
  };
  const data = await MONGO_DB.createNewRoom(newRoom);
  res.status(201).send({ status: data }); // data är returnen i funktionen i db.js
});

app.delete("/rooms/:id", async (req, res) => {
  let roomId = req.params.id;
  const data = await MONGO_DB.deleteRoom(roomId);
  res.status(204).send({ status: data });
});

/*-------------------------*/

// Socket kommer från frontend
io.on("connection", (socket) => {
  console.log("A user connected, id: ", socket.id);

  socket.on("send message", async (data) => {
    await MONGO_DB.saveMessage(data); // Sparar till db

    io.sockets.emit("new message", data);
  });
});

http.listen(8080, () => {
  console.log("Server started 8080");
});

/*-------------------------*/

//app.use(express.static("./build")); //för att starta server och frontend samtidigt. OBS! Kör npm run build först, sen starta nodemon

