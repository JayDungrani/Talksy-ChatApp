import { generateToken } from "../config/tokenGenerator.js";
import { User } from "../models/userModel.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const newUser = new User({name, email, password})
        await newUser.save()

        const token = await generateToken(newUser._id)
        res.cookie("jwtToken", token,{
            httpOnly : true,
            secure : true,
            samesite : "strict",
            maxAge : 10 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({message : "SignUp successfull!"});

    } catch (error) {
        res.status(500).json({ message: "Server error!"});
    }
}

export const login = async(req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select("+password");
        if(!user) {
            return res.status(400).json({message : "Enter correct email address!"})
        }

        const isMatch = await user.matchPassword(password)
        if(!isMatch){
            return res.status(400).json({message : "Enter correct password!"})
        }
        const token = await generateToken(user._id)
        res.cookie("jwtToken", token,{
            httpOnly : true,
            secure : true,
            samesite : "strict",
            maxAge : 10 * 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({message : "Logged in successfully"});
    } catch (error) {
        res.status(400).json({message : "Server Error!"})
    }
}

export const logOut = async(req, res)=>{
    try {
        res.clearCookie("jwtToken")
        return res.status(200).json({ message: "Logged out successfully" });      
    } catch (error) {
        res.status(400).json({message : "Server Error!"})
    }
}

export const getMe = async(req, res)=>{
    try {
        const {userId} = req.token
        const foundUser = await User.findById(userId)
        res.status(200).json({user : foundUser})
    } catch (error) {
        res.status(400).json({message : "User not found!"})
    }
}

export const getUsersList = async(req, res)=>{
    try {
        const searchQuery = req.query.search || ""; // Get search query from request
        const regex = new RegExp(searchQuery, "i"); // Case-insensitive search

        const users = await User.find({ name: regex })
        .select('name profilePicture status'); // Find users by name
        res.status(200).json({usersList : users});
    } catch (error) {
        res.status(500).json({ message: "Server Error!" });
    }
}

export const getUser = async(req, res)=>{
    try {
        const userId = req.query.id;
        const foundUser = await User.findById(userId)
        return res.status(200).json({user : foundUser})
    } catch (error) {
        return res.status(400).json({message : "User not found!"})
    }
}