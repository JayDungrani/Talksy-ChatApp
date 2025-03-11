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

        const token = generateToken(newUser._id)
        res.cookie("jwtToken",token,{
            httpOnly : true,
            secure : true,
            samesite : "strict",
            maxAge : 10 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(newUser);

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

export const login = async(req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select("+password");
        if(!user) {
            return res.status(400).json({message : "Invalid credintials"})
        }

        const isMatch = await user.matchPassword(password)
        if(!isMatch){
            return res.status(400).json({message : "Invalid credintials"})
        }
        const token = await generateToken(user._id)
        res.cookie("jwtToken", token,{
            httpOnly : true,
            secure : true,
            samesite : "strict",
            maxAge : 10 * 24 * 60 * 60 * 1000
        })

        res.status(200).json(user);
    } catch (error) {
        
    }
}

export const logOut = async(req, res)=>{
    res.clearCookie("jwtToken")
    return res.status(200).json({ message: "Logged out successfully" });
}