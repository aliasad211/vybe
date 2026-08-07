import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getConversations, getMessages, sendMessage } from "../controllers/message.controllers.js";

const messageRouter = express.Router();

messageRouter.get("/conversations", isAuth, getConversations);
messageRouter.get("/:userId", isAuth, getMessages);
messageRouter.post("/send/:userId", isAuth, sendMessage);

export default messageRouter;
