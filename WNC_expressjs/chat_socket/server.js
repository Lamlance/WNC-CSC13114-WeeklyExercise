import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";
const PORT = 3070;

const app = express();
const httpServer = app.listen(PORT, function () {
  console.log(`Listening on http://127.0.0.1:${PORT}`);
});

const socket_server = new SocketServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use("/", express.static("./chat_socket/public"));

socket_server.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
});

const chat_namespace = socket_server.of("/chat");
chat_namespace.on("connection", function (socket) {
  console.log("Socket connect: ", socket.id);

  const user_name = `${socket.handshake.query.name}_${socket.id}`;

  socket.on("message", function (data) {
    broadcast_chatmsg(user_name, data);
  });
  broadcast_chatmsg("global", `${user_name} has connected`);
});

function broadcast_chatmsg(name, msg) {
  chat_namespace.emit("message", {
    name: name,
    message: msg,
  });
}

//middleware
chat_namespace.use(function (socket, next) {
  next();
});
