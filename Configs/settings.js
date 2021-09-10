const express = require("express");
const logger = require("../Api/Logger/log")

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
  socket: any = io.on('connection', (socket) => {
    logger.info(`User with socketId: ${socket.id} connected`);
    socket.on("disconnect", () => logger.info(`User with socketId: ${socket.id} disconnected`));
  })
};
