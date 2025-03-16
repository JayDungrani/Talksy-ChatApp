import { Chat } from "../models/chatModel.js"

export const createGroupChat = async(req, res)=>{
    try {
        const defaultPic = "https://w7.pngwing.com/pngs/522/207/png-transparent-profile-icon-computer-icons-business-management-social-media-service-people-icon-blue-company-people.png"

        const {adminsId, chatName, members, profilePicture = defaultPic} = req.body

        const newGroup = new Chat({
            isGroupChat : true,
            chatName : chatName,
            members : members,
            admins : adminsId,
            profilePicture : profilePicture
        })

        await newGroup.save()
        res.status(200).json({message : "Group created successfully!", newGroup})

    } catch (error) {
        res.status(400).json({message : error.message})
    }
}

export const getAllChats = async(req, res)=>{
    try {
        const {userId} = req.token

        const normalChats = await Chat.find({members : userId, isGroupChat : false})
        .populate('members', 'name email profilePicture')
        .populate('latestMessage')
        .sort({updatedAt : -1})

        const groupChats = await Chat.find({members : userId, isGroupChat : true})
        .populate('latestMessage')
        .sort({updatedAt : -1})

        const formattedNormalChat = normalChats.map(chat =>({
            ...chat._doc,
            latestMessage : chat.latestMessage || {content : "No messages yet!"}
        }))

        const formattedGroupChat = groupChats.map(chat =>({
            ...chat._doc,
            latestMessage : chat.latestMessage || {content : "No messages yet!"}
        }))
        res.status(200).json({normalChats : formattedNormalChat, groupChats : formattedGroupChat})

    } catch (error) {
        res.status(400).json({message : error.message})
    }
}

export const getChatById = async(req, res)=>{
    try {
        const {userId} = req.token;
        const {chatId} = req.params;

        const chat = await Chat.find({_id : chatId, members : userId})
        .populate('members', 'name email profilePicture')
        .populate('admins', 'name email profilePicture status')

        if(!chat){
            return res.status(404).json({message : "Chat not found!"})
        }
        res.status(200).json({chat : chat})

    } catch (error) {
        res.status(400).json({message : error.message})
    }
}

export const renameChat = async(req, res)=>{
    try {
        const {userId} = req.token;
        const {chatId, chatName} = req.body;

        const chat = await Chat.findOneAndUpdate(
            {_id : chatId, admins : userId},
            {chatName : chatName},
            {new : true}
        );

        if(!chat){
            return res.status(400).json({message : "Chat not found! or You are not authorized to rename!"})
        }

        res.status(200).json({message : "Group renamed successfully!", chat})
    } catch (error) {
        res.status(2400).json({message : error.message})
    }
}

export const addMember = async(req, res)=>{
    try {
        const { userId } = req.token;  
        const { chatId, memberId } = req.body;

        if (!chatId || !memberId) {
            return res.status(400).json({ message: "Chat ID and Member ID are required!" });
        }

        // Find the chat first
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        // Check if the user is an admin
        if (!chat.admins.includes(userId)) {
            return res.status(403).json({ message: "You are not authorized to add members!" });
        }

        // Check if the member is already in the chat
        if (chat.members.includes(memberId)) {
            return res.status(400).json({ message: "User is already a member of this chat!" });
        }

        // Add the member
        chat.members.push(memberId);
        await chat.save();

        res.status(200).json({ message: "Member added successfully!", chat });

    } catch (error) {
        res.status(400).json({message : error.message})
    }
}

export const removeMember = async(req, res)=>{
    try {
        const { userId } = req.token;  // Admin's ID
        const { chatId, memberId } = req.body;

        if (!chatId || !memberId) {
            return res.status(400).json({ message: "Chat ID and Member ID are required!" });
        }

        // Find the chat first
        const chat = await Chat.findOne({ _id: chatId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        // Check if the user is an admin
        if (!chat.admins.includes(userId)) {
            return res.status(403).json({ message: "You are not authorized to remove members!" });
        }

        // Check if the member exists in the chat
        if (!chat.members.includes(memberId)) {
            return res.status(400).json({ message: "User is not a member of this chat!" });
        }

        // Prevent an admin from removing themselves (optional)
        if (userId === memberId) {
            return res.status(400).json({ message: "Admins cannot remove themselves!" });
        }

        // Remove the member
        chat.members = chat.members.filter((member) => member.toString() !== memberId);
        await chat.save();

        res.status(200).json({ message: "Member removed successfully!", chat });

    } catch (error) {
        console.error("Error removing member:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
