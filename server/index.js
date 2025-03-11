import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/user", userRoutes)

app.listen(process.env.port, ()=>{
    console.log('server started')
})