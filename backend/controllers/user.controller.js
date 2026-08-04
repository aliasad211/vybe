import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

const getCurrentUser = async(req,res)=>{
    try{
         const userId =  req.userId;
         const user = await User.findById(userId).populate("posts loops");

         if(!user){
            return res.status(400).json({
                message:"user not found!"
            })
         }

         return res.status(200).json(user);

    }catch(error){
         return res.status(500).json({message:`get current user error ${error}`});
    }
}

export default getCurrentUser;

export const suggestedUsers = async(req,res)=>{
    try{
      const users = await User.find({
        _id:{$ne:req.userId}
      }).select("-password");
      return res.status(200).json(users);
    }catch(error){
      return res.status(500).json({message:`get suggested user error ${error}`});
    }
}

export const editProfile = async(req,res)=>{
  try{
   const {name, userName, bio, profession, gender} = req.body;
   const user = await User.findById(req.userId).select("-password");
   if(!user){
    return res.status(400).json({message:"user not found"});
   }
   const sameUserWithUserName = await User.findOne({userName}).select("-password");
   if(sameUserWithUserName && sameUserWithUserName._id.toString() !== req.userId){
    return res.status(400).json({message:"userName already exist"});
   }

   let profileImage;
   if(req.file){
    profileImage = await uploadOnCloudinary(req.file.path)
   }

   user.name = name
   user.userName = userName
   
   if(profileImage){
    user.profileImage = profileImage
   }
   user.bio = bio
   user.profession = profession
   user.gender = gender

   await user.save()

   return res.status(200).json({
    message: "Profile edit successfully",
    user
});
  }catch(error){
   return res.status(500).json({message:`edit profile error ${error}`})
  }
}

export const follow = async(req,res)=>{
  try{
    const currentUserId = req.userId;
    const targetUserId = req.params.userId;

    if(currentUserId.toString() === targetUserId.toString()){
      return res.status(400).json({message:"you can not follow yourself"});
    }

    const currentUser = await User.findById(currentUserId).select("-password");
    const targetUser = await User.findById(targetUserId).select("-password");

    if(!currentUser || !targetUser){
      return res.status(400).json({message:"user not found"});
    }

    const isFollowing = currentUser.following.some(
      id => id.toString() === targetUserId.toString()
    );

    if(isFollowing){
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId.toString());
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
    }else{
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    //profile page needs the follower/following avatars, so send them populated
    await targetUser.populate("followers", "name userName profileImage");
    await targetUser.populate("following", "name userName profileImage");

    return res.status(200).json({
      following: !isFollowing,
      currentUser,
      targetUser
    });
  }catch(error){
    return res.status(500).json({message:`follow error ${error}`})
  }
}

export const getProfile = async(req,res)=>{
  try{
    const userName = req.params.username;
    const user = await User.findOne({userName})
      .select("-password")
      .populate("followers", "name userName profileImage")
      .populate("following", "name userName profileImage");

    if(!user){
      return res.status(400).json({message:"user not found"});
    }

    return res.status(200).json(user);

  }catch(error){
    return res.status(500).json({message:`get profile error ${error}`})
  }
}