import { use } from "react";
import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model";

//upload post controller
export const uploadPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body;
        let media = "";
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({ message: "media is required" });
        }
        //save in DB
        const post = await Post.create({
            caption,
            mediaType,
            media,
            author: req.userId
        });

        const user = await User.findById(req.userId)
        user.posts.push(post._id)
        await user.save()

        const populatedPost = await Post.findById(post._id).populate("author", "name userName profileImage");

        return res.status(201).json({ message: "Post uploaded Successfully", populatedPost });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

//get all my post controller
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.userId }).populate("author", "name userName profileImage");
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//like controller
export const like = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" });
        }
        const isLiked = post.likes.some(
            id => id.toString() === req.userId.toString()
        );

        if(isLiked){
            post.likes = post.likes.filter(id=>id.toString() != req.userId.toString());
        }else{
            post.likes.push(req.userId);
        }
        
        await post.save();
        post.populate("author", "name userName profileImage");
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//comment controller
export const comment = async (req, res) => {
    try {
       const {message} = req.body;
       const postId = req.params.postId;
       const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" });
        }
        post.comments.push({
            author:req.userId,
            message:message
        })

        await post.save();
        post.populate("author", "name userName profileImage"),
        post.populate("comments.author")
        return res.status(200).json(post);
    } catch (error) {
     return res.status(500).json({ message: error.message });
    }
}


//saved post controller
export const saved = async(req,res)=>{
    try{
       const postId = req.params.postId;
       const user = await User.findById(req.userId)

        const isSaved = user.likes.some(
            id => id.toString() === postId.toString()
        );

        if(isSaved){
            user.saved = user.saved.filter(id=>id.toString() != req.postId.toString());
        }else{
            user.saved.push(postId);
        }
        await user.save()
        user.populate("saved")
        return res.status(200).json(user)
    }catch(error){
     return res.status(500).json({ message: error.message });
    }
}