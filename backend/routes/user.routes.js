import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import getCurrentUser, { editProfile, getProfile, suggestedUsers } from "../controllers/user.controller.js";
import { comment, getAllPosts, like, saved, uploadPost } from "../controllers/post.controllers.js";

const userRouter = express.Router();

userRouter.post("/upload", isAuth,upload.single("media"), uploadPost);
userRouter.get("/getAll", isAuth, getAllPosts);
userRouter.get("/like/:postId", isAuth, like);
userRouter.get("/save/:postId", isAuth, saved);
userRouter.post("/comment/:postId", isAuth, comment);

export default userRouter;