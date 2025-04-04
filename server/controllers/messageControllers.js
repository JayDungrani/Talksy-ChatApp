import { Chat } from '../models/chatModel.js';
import { Message } from '../models/messageModel.js'

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messageList = await Message.find({ chat: chatId })
            .populate('sender', 'name profilePicture')
        if (!messageList) {
            return res.status(404).json({ message: "No messages yet!" });
        }
        res.status(200).json(messageList)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.token;
        const { chatId, content } = req.body;

        let message = new Message({
            sender: userId,
            chat: chatId,
            content: content,
        })

        message = await message.save()
        message = await message.populate("sender", "name profilePicture")
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id })

        res.status(200).json( message )
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const readMessage = async (req, res) => {
    try {
        const { userId } = req.token;
        const { chatId } = req.params;

        const updateMessage = await Message.updateMany(
            { chat: chatId, sender: { $ne: userId }, isRead: false },
            { $set: { isRead: true } }
        )
        res.status(200).json({ message: "Updated message successfully!", updateMessage })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}