import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const PORT = 3000;
const server = createServer(app);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true }
});

const users = new Map(); // userId -> socket.id

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("error", (err) => console.error("Socket error:", err));

  // Register user with persistent ID
  socket.on("register-user", (userId) => {
    if (!userId) return;

    socket.userId = userId;
    users.set(userId, socket.id);

    // Send welcome message
    socket.emit("welcome", `Welcome! Your ID is ${userId}`, (ack) => {
      if (ack === "received") console.log(`Client ${userId} received welcome message successfully`);
    });

    // Update all clients with current users
    io.emit("current-users", Array.from(users.keys()));

    // Notify others
    socket.broadcast.emit("user-joined", `User ${userId} joined`);
  });

  // Handle chat/message event
  socket.on("message", (msg) => {
    if (!msg) return;
    console.log(`Received message from ${socket.userId}:`, msg);

    // Broadcast to all clients
    io.emit("message", { user: socket.userId, text: msg });
  });

  socket.on("disconnect", (reason) => {
    if (socket.userId) {
      console.log(`User disconnected: ${socket.userId} (${socket.id}) reason: ${reason}`);
      users.delete(socket.userId);

      io.emit("current-users", Array.from(users.keys()));
      socket.broadcast.emit("user-left", `User ${socket.userId} left`);
    } else {
      console.log(`Unknown socket disconnected: ${socket.id} reason: ${reason}`);
    }
  });
});
