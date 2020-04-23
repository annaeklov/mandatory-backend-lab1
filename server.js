const express = require("express");
const fs = require("fs");
const app = express();
const jsonData = require("./data.json");

const http = require("http").createServer(app);
const io = require("socket.io")(http, { origins: "*:*" });

app.use(express.json());

/*-----------*/

app.get("/users", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) return res.status(400).end();
    res.status(200).send(jsonData);
  });
});

io.on("connection", (socket) => {
  console.log("A user connected");
});

http.listen(8080, () => {
  console.log("Server started 8080");
});

/*----*/
//app.use(express.static("./build")); //för att starta server och frontend samtidigt. OBS! Kör npm run build först, sen starta nodemon
