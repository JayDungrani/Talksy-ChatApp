import {Router} from 'express'
import authMiddleware from "../middleware/authMiddlware.js"
import { addMember, createGroupChat, getAllChats, getChatById, removeMember, renameChat, updateProfile } from '../controllers/chatController.js'

const router = Router()

router.route("/group").post(authMiddleware, createGroupChat)
router.route("/").get(authMiddleware, getAllChats)
router.route("/:chatId").get(authMiddleware, getChatById)
router.route("/rename").put(authMiddleware, renameChat)
router.route("/add").put(authMiddleware, addMember)
router.route("/remove").put(authMiddleware, removeMember)
router.route("/groupchange").put(authMiddleware, updateProfile)
export default router