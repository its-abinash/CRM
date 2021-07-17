const express = require("express");

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

module.exports = {
  app: app,
  server: httpServer,
  socket: io,
};
