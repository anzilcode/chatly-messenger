const { Server } = require("socket.io");
const Message = require("../models/Message"); 

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`${userId} joined their room`);
    });

    socket.on("sendMessage", async (message) => {
      try {
        const newMessage = new Message({
          senderId: message.senderId,
          receiverId: message.receiverId,
          text: message.text,
        });
        await newMessage.save();

        io.to(message.receiverId).emit("receiveMessage", message);

        socket.emit("receiveMessage", message);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
