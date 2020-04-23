const express = require("express");
const fs = require("fs");
const app = express();
const jsonData = require("./data.json");

// Socket.io med Express
const http = require("http").createServer(app);
const io = require("socket.io")(http, { origins: "*:*" });

app.use(express.json());

/*-----------*/

app.get("/rooms", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) return res.status(400).end();
    res.status(200).send(jsonData);
  });
});

// Socket kommer från frontend
io.on("connection", (socket) => {
  console.log("A user connected, id: ", socket.id);

  // Kommer en socket.emit("send message") från frontend, som hamnar här
  // Data i socket.on = objekt som innehåller namn, meddelande och roomId som kommer från frontend
  // io.socketSSSSSS betyder att alla som är uppkopplade får detta 
  // Data i io.sockets.emit = samma som ovan
  // Den datan skickas tillbaka till frontend med socket.on("new message") i frontend
  
  socket.on("send message", (data) => {
    console.log("in send message", data)
      // Här ska data sparas i jsonData-fil. OBS, hitta rätt room
    io.sockets.emit("new message", data);
  });
});

http.listen(8080, () => {
  console.log("Server started 8080");
});

/*----

//app.use(express.static("./build")); //för att starta server och frontend samtidigt. OBS! Kör npm run build först, sen starta nodemon

- Statuskoder för alla olika
app.get("/rooms/:id", (req, res) => {}); 
app.post("/rooms", (req, res) => {});
app.delete("/rooms/:id", (req, res) => {});

*/
