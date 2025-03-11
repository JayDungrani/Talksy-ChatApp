import { Router } from "express";
import { login, logOut, signUp } from "../controllers/userController.js";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logOut);

export default router;