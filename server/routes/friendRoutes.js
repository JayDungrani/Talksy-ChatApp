import { Router } from "express";
import { acceptRequest, rejectRequest, sendRequest } from "../controllers/friendController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = Router()

router.route("/send/:receiverId").post(authMiddleware, sendRequest)
router.route("/accept/:requestId").post(authMiddleware, acceptRequest)
router.route("/reject/:requestId").post(authMiddleware, rejectRequest)

export default router;