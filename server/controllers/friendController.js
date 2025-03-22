import { Chat } from "../models/chatModel.js"
import { FriendRequest } from "../models/friendRequestModel.js"
import { User } from "../models/userModel.js"

export const sendRequest = async (req, res) => {
    try {
        const senderId = req.token.userId
        const {receiverId} = req.params

        const checkUser = await User.findById(receiverId)

        //check if user exists
        if (!checkUser) {
            return res.status(404).json({ message: "User not found!" })
        }

        //check if sender and receiver are same
        if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot add yourself as a friend!" })
        }

        //check if request already exists
        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            recipient: receiverId,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(409).json({ message: "Friend request already sent!" });
        }

        //check if sender and receiver are already friends
        const existingFriend = await Chat.findOne({
            isGroupChat : false,
            members : {$all : [senderId, receiverId]}
        })
        if(existingFriend){
            return res.status(409).json({message : "You are already friends and have an active chat"})
        }

        const createRequest = new FriendRequest({ sender: senderId, recipient: receiverId })
        await createRequest.save()

        res.status(200).json({message : "Request sent successfully!", friendRequest: createRequest })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const acceptRequest = async(req, res)=>{
    try {
        const receiverId = req.token.userId
        const {requestId} = req.params

        const friendRequest = await FriendRequest.findById(requestId)
        if(!friendRequest){
            res.status(404).json({message : "Friend request not found!"})
        }

        const senderId = friendRequest.sender
        const existingChat = await Chat.findOne({
            isGroupChat: false,
            members: { $all: [senderId, receiverId] }
        });
        if (existingChat) {
            return res.status(409).json({ message: "You are already friends and have an active chat!" });
        }

        friendRequest.status = 'accepted'
        await friendRequest.save()

        const newChat = new Chat({
            isGroupChat : false,
            members : [senderId, receiverId]
        })
        await newChat.save()

        res.status(200).json({message : "Request accepted successfully!"})
    } catch (error) {
        res.status(400).json({message : error.message})
    }
}

export const rejectRequest = async(req, res)=>{
    try {
        const {requestId} = req.params

        const friendRequest = await FriendRequest.findById(requestId)
        if(!friendRequest){
            res.status(404).json({message : "Friend request not found!"})
        }
        else if(friendRequest.status === 'accepted'){
            res.status(409).json({message : "Friend Request is already accepted!"})
        }

        friendRequest.status = 'rejected'
        await friendRequest.save()

        res.status(200).json({message : "Request rejected successfully!"})

    } catch (error) {
        res.status(400).json(error.message)
    }
}