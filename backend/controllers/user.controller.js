import User from "../models/user.model.js";

const getCurrentUser = async(req,res)=>{
    try{
         const userId =  req.userId;
         const user = await User.findById(userId);

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