import express from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
} from "../controllers/auth.controller.js";
import { getme } from "../controllers/get.me.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router();

//authroutes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);

//dashboardroutes
router.get("/me",verifyJWT,getme)

export default router;
