import { Chat } from "../models/chatModel.js"
import { Message } from "../models/messageModel.js";

export const getUnreadMessages = async (userId) => {
    const chats = await Chat.find({ members: userId }).populate('latestMessage');

    const chatUnreadCounts = await Promise.all(
        chats.map(async (chat) => {
            const unreadCount = await Message.countDocuments({
                chat: chat._id,
                sender: { $ne: userId }, // Messages not sent by the user
                isRead: false, // Messages that are unread
            });
            return {
                chatId: chat._id,
                unreadCount,
            };
        })
    );
    return chatUnreadCounts;
}