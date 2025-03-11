import { Router } from "express";
import { getUser, getMe, login, logOut, signUp, getAllUsers } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/me").get(authMiddleware, getMe)
router.route("/all").get(authMiddleware, getAllUsers)
router.route("/getuser").get(authMiddleware, getUser)
export default router;