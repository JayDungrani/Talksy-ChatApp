import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String, default: "" },
    status: { type: String, default: "Hey there! I'm using Talksy" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},
    { timestamps: true }
)


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.model("User", userSchema)
