import { Router } from "express";
import { getMe, login, logOut, signUp, getUsersList, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddlware.js";
import { uploadImage} from "../config/cloudinarySetup.js";
import multer from 'multer';

const storage = multer.memoryStorage(); // Store file in memory as buffer
const upload = multer({ storage }); 
const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/me").get(authMiddleware, getMe)
router.route("/searchlist").get(authMiddleware, getUsersList)
router.route("/update").post(authMiddleware, updateProfile)
router.route("/picture").post(authMiddleware,upload.single('image'), uploadImage)

export default router;