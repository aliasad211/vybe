import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getNotifications, markNotificationsSeen } from "../controllers/notification.controllers.js";

const notificationRouter = express.Router();

notificationRouter.get("/", isAuth, getNotifications);
notificationRouter.patch("/seen", isAuth, markNotificationsSeen);

export default notificationRouter;
