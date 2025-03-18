import {Router} from 'express';
import authMiddleware from "../middleware/authMiddlware.js";
import { getNotification } from '../controllers/notificationController.js';

const router = Router()

router.route("/").get(authMiddleware, getNotification)

export default router