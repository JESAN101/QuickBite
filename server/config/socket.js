/**
 * Singleton Socket.IO instance.
 * Import this module anywhere on the server to emit real-time events.
 * Call `init(server)` once from server.js — every other file imports `getIO()`.
 */
let io = null;

const init = (httpServer) => {
  const { Server } = require("socket.io");

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Client joins a room keyed by their userId so we can target them.
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialised — call init() first.");
  return io;
};

module.exports = { init, getIO };
