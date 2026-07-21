import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";

export const uploadPost = async(req,res)=>{
    try{
       const {caption,mediaType} = req.body;
       let media = "";
       if(req.file){
        media = await uploadOnCloudinary(req.file.path);
       }else{
        return res.status(400).json({message:"media is required"});
       }
       //save in DB
       const post = await Post.create({
        caption,
        mediaType,
        media,
        author:req.userId
       });

       const populatedPost = await Post.findById(post._id).populate("author","name userName profileImage");

       return res.status(201).json({message:"Post uploaded Successfully", populatedPost});
    }catch(error){
         console.log(error);
         return res.status(500).json({message:error.message});
    }
}