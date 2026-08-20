import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
    //a like or comment points at whichever of the two it landed on; a follow at neither
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    loop: { type: mongoose.Schema.Types.ObjectId, ref: "Loop" },
    seen: { type: Boolean, default: false }
}, { timestamps: true })

//the inbox query: this user's notifications, newest first
notificationSchema.index({ recipient: 1, createdAt: -1 });
//the "has this already been raised" lookup that keeps like/follow from duplicating
notificationSchema.index({ recipient: 1, sender: 1, type: 1, post: 1, loop: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
