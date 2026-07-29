import User from "../models/user.model.js";
import Story from "../models/story.model.js";

export const uploadStory = async(req,res)=>{
    try{
       const user = await User.findById(req.userId);
       if(user.story){
        await Story.findByIdAndDelete(user.story)
        user.story = null;
       }
       const {mediaType} = req.body;
       let media;
       if(req.file){
        media = await uploadOnCloudinary(req.file.path);
       }else{
        return res.status(400).json({message:"media is required"})
       }

       const story = await Story.create({
        author:req.userId,mediaType,media
       })
       user.story = story._id
       await user.save()
       const populatedStory = await Story.findById(story._id)
       .populate("author","name  userName profileImage")
       .populate("viewers","name userName profileImage")

       return res.status(200).json(populatedStory)
    }catch(error){
       return res.status(500).json({message:"upload story error"})
    }
}