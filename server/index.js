import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import friendRoutes from './routes/friendRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import notificationRoutes from "./routes/notificationRoutes.js"
import cors from 'cors'
import { socketSetup } from './config/socketStup.js'

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : [process.env.FRONTEND_URL,"http://localhost:5173"],
    credentials : true,
}))

app.use("/api/user", userRoutes)
app.use("/api/friend", friendRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/notification", notificationRoutes)

const server = app.listen(process.env.PORT, ()=>{
  console.log('server started')
})

socketSetup(server)


