import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    chatName: { type: String, default: "One-to-One Chat" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);

