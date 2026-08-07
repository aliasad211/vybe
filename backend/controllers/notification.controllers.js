import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../socket.js";

//used by other controllers (follow/like/comment) to raise a notification
export const createNotification = async ({ recipient, sender, type, post }) => {
    if (recipient.toString() === sender.toString()) {
        return null;
    }

    let notification = await Notification.create({ recipient, sender, type, post });
    notification = await notification.populate("sender", "name userName profileImage");
    notification = await notification.populate("post", "media mediaType");

    const receiverSocketId = getReceiverSocketId(recipient);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
    }

    return notification;
}

//get all notifications for the logged in user, most recent first
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .populate("sender", "name userName profileImage")
            .populate("post", "media mediaType")
            .sort({ createdAt: -1 });

        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//mark every unseen notification for the logged in user as seen
export const markNotificationsSeen = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.userId, seen: false },
            { seen: true }
        );

        return res.status(200).json({ message: "notifications marked as seen" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
