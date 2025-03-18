import { FriendRequest } from "../models/friendRequestModel.js"

export const getNotification = async(req, res)=>{
    try {
        const {userId} = req.token
        const requestList = await FriendRequest.find({recipient : userId})
        .populate("sender","name profilePicture").sort({updatedAt : -1})
        res.status(200).json(requestList);
    } catch (error) {
        res.status(400).json({message : error.message})
    }
}