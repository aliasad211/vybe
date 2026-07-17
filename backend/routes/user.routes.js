import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import getCurrentUser, { editProfile, getProfile, suggestedUsers } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/suggested", isAuth, suggestedUsers);
userRouter.get("/getProfile/:userName", isAuth, getProfile);
userRouter.post("/editProfile", isAuth, upload.single("profileImage"), editProfile);

export default userRouter;