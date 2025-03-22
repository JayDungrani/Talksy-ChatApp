import { Server } from "socket.io";
import { User } from '../models/userModel.js';

export const socketSetup = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.FRONTEND_URL
    }
  });

  io.on("connection", (socket) => {
  
    // Notify everyone on room that user is online
    socket.on("userConnected", async (userId) => {
      socket.userId = userId;
      await User.findByIdAndUpdate(userId, { isOnline: true }, { new: true }).exec()
      socket.broadcast.emit("userOnline", userId);
    });

    //Notify everyone that user is offline
    socket.on("userDisconneted", async (userId) => {
      await User.findByIdAndUpdate(userId, { isOnline: false }, { new: true }).exec()
      socket.broadcast.emit("userOffline", userId)
    });

    //join room when clicked on chat
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
    });

    //leave room on leave chat
    socket.on('leaveRoom', async (chatId) => {
      socket.leave(chatId);
    });

    socket.on("sendMessage", (message) => {
      try {
        io.to(message.chat).emit("new_message", message);
        socket.broadcast.emit("globalMessage",message)
      } catch (error) {
        console.log(error)
      }
      // Emit the message to the chat room
    });
  });
}