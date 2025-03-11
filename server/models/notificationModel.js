import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);

