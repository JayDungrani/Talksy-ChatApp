import { Router } from "express";
import { getMessages, readMessage, sendMessage } from "../controllers/messageControllers.js";
import authMiddleware from "../middleware/authMiddlware.js"
const router = Router()

router.route("/:chatId").get(authMiddleware ,getMessages)
router.route("/send").post(authMiddleware, sendMessage)
router.route("/read/:chatId").put(authMiddleware, readMessage)

export default router