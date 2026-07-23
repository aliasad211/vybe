import uploadOnCloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js"
import User from "../models/user.model.js";

//upload loop controller
export const uploadLoop = async (req, res) => {
    try {
        const { caption} = req.body;
        let media = "";
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({ message: "media is required" });
        }
        //save in DB
        const loop = await Loop.create({
            caption,
            media,
            author: req.userId
        });

        const user = await User.findById(req.userId)
        user.loops.push(loop._id)
        await user.save()

        const populatedLoop = await Loop.findById(loop._id).populate("author", "name userName profileImage");

        return res.status(201).json({ message: "Loop uploaded Successfully", populatedLoop });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
