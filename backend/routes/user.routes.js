import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import getCurrentUser, { editProfile, getProfile, suggestedUsers } from "../controllers/user.controller.js";
import { comment, getAllPosts, like, saved, uploadPost } from "../controllers/post.controllers.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

userRouter.get("/suggested", isAuth, suggestedUsers);

userRouter.post(
  "/editProfile",
  isAuth,
  upload.single("profileImage"),
  editProfile
);

userRouter.get("/profile/:username", isAuth, getProfile);
export default userRouter;