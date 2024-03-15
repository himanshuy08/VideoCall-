import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const PORT = 8000;


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connect", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
