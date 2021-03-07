const express = require("express");
const cors = require("cors");
const db = require("./model");

const server = express();
server.use(cors());
server.use(express.json());

// server.get("/", (req, res) => {
//   res.status(200).json({ message: "API is active" });
// });

server.get("/", (req, res) => {
  res.status(200).json("hello");
});

server.get("/viewers", (req, res) => {
  db.getAllUsers()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

server.get("/emotes", (req, res) => {
  db.getEmotes().then((data) => {
    res.status(200).json(data);
  });
});

module.exports = server;
