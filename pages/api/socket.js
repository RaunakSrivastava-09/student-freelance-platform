import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Socket is initializing...");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data); 
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}