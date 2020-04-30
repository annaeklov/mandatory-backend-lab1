const express = require("express");
const app = express();

// Socket.io med Express
const http = require("http").createServer(app);
const io = require("socket.io")(http, { origins: "*:*" });

app.use(express.json());

const MONGO_DB = require("./db");

/*-----------*/

app.get("/rooms", async (req, res) => {
  const data = await MONGO_DB.getAllRooms(); // just denna funktionen från db.js-filen
  console.log("DATA från get i severn", data);
  if (data.length) {
    res.status(200).send(data);
  } else {
    res.status(400).end();
  }
});

app.post("/rooms", async (req, res) => {
  if (!req.body.data === String) {
    return res.status(400).end(); // kolla rätt statuskod, kanske mer säker
  }
  let newRoom = {
    roomName: req.body.data,
    messages: [],
    isDefault: false,
  };
  const data = await MONGO_DB.createNewRoom(newRoom);
  res.status(201).send({ status: data });
});

// app.post...... osv
// socket.on in FÖRE db.collection

app.delete("/rooms/:id", async (req, res) => {
  console.log("i servern delete");

  let roomId = req.params.id;
  console.log(req.params.id);

  const data = await MONGO_DB.deleteRoom(roomId);
  console.log(data);

  res.status(204).send({ status: data });
});

// Socket kommer från frontend
io.on("connection", (socket) => {
  console.log("A user connected, id: ", socket.id);

  // Kommer en socket.emit("send message") från frontend, som hamnar här
  // Data i socket.on = objekt som innehåller namn, meddelande och roomId som kommer från frontend
  // io.socketSSSSSS betyder att alla som är uppkopplade får detta
  // Data i io.sockets.emit = samma som ovan
  // Den datan skickas tillbaka till frontend med socket.on("new message") i frontend

  socket.on("send message", async (data) => {
    console.log("in send message", data);

    // spara meddelande i rätt rum

    io.sockets.emit("new message", data);
    console.log("in new message", data);
  });
});

http.listen(8080, () => {
  console.log("Server started 8080");
});

/*----

//app.use(express.static("./build")); //för att starta server och frontend samtidigt. OBS! Kör npm run build först, sen starta nodemon



*/
