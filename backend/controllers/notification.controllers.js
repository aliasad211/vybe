import Notification from "../models/notification.model.js";
import { emitToUser } from "../socket.js";

const POPULATE = [
    { path: "sender", select: "name userName profileImage" },
    { path: "post", select: "media mediaType" },
    { path: "loop", select: "media" }
];

//a comment is an event — every one of them deserves its own row. a like and a
//follow are states, so re-raising one should not stack up a second notification
const isRepeatable = (type) => type === "comment";

//narrows to the one row a like/follow is allowed to have. mongoose drops the
//undefined keys, so a follow matches on sender + type alone
const identity = ({ recipient, sender, type, post, loop }) => ({ recipient, sender, type, post, loop });

//used by other controllers (follow/like/comment) to raise a notification
export const createNotification = async ({ recipient, sender, type, post, loop }) => {
    if (recipient.toString() === sender.toString()) {
        return null;
    }

    const target = { recipient, sender, type, post, loop };

    if (!isRepeatable(type)) {
        const existing = await Notification.findOne(identity(target));
        if (existing) {
            return null;
        }
    }

    const notification = await Notification.create(target);
    await notification.populate(POPULATE);

    emitToUser(recipient, "newNotification", notification);

    return notification;
}

//the other half of a toggle: unliking or unfollowing takes the notification back
//out rather than leaving a stale "liked your post" in the recipient's inbox
export const removeNotification = async ({ recipient, sender, type, post, loop }) => {
    if (recipient.toString() === sender.toString()) {
        return null;
    }

    const removed = await Notification.findOneAndDelete(
        identity({ recipient, sender, type, post, loop })
    );

    if (removed) {
        emitToUser(recipient, "notificationRemoved", removed._id);
    }

    return removed;
}

//get all notifications for the logged in user, most recent first
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .populate(POPULATE)
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
