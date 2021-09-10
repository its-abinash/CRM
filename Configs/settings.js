const express = require("express");
const logger = require("../Api/Logger/log");

const app = express();

const httpServer = require("http").Server(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Create express app instance here and export it.
// I've done this (in singleton design pattern) to avoid
// creation of app instance more than once.

// In order to debug, we can use socketId inside the callback,
// i.e (socket) => { console.log(socket.id) }
var socketInstance = io.on("connection", (socket) => { socket.on("disconnect", () => {}); })

module.exports = {
  app: app,
  server: httpServer,
  socket: socketInstance
};
