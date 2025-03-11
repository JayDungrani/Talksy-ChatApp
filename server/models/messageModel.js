import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

