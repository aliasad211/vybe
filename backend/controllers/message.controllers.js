import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { emitToUser } from "../socket.js";

//get all conversations for the logged in user, most recently active first
export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.userId })
            .populate("participants", "name userName profileImage")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//get the full message thread between the logged in user and another user
export const getMessages = async (req, res) => {
    try {
        const otherUserId = req.params.userId;

        const conversation = await Conversation.findOne({
            participants: { $all: [req.userId, otherUserId] }
        });

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = await Message.find({ conversation: conversation._id })
            .sort({ createdAt: 1 });

        await Message.updateMany(
            { conversation: conversation._id, receiver: req.userId, seen: false },
            { seen: true }
        );

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//send a message to another user, creating the conversation on first contact
export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const receiverId = req.params.userId;

        if (!text?.trim()) {
            return res.status(400).json({ message: "message text is required" });
        }

        if (receiverId.toString() === req.userId.toString()) {
            return res.status(400).json({ message: "you can not message yourself" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [req.userId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.userId, receiverId]
            });
        }

        const message = await Message.create({
            conversation: conversation._id,
            sender: req.userId,
            receiver: receiverId,
            text
        });

        conversation.lastMessage = message._id;
        await conversation.save();

        emitToUser(receiverId, "newMessage", message);

        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
