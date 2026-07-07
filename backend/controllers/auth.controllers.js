import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup=async(req,res)=>{
    try{
       const {name,email,password,userName} =req.body;
       const findByEmail = await User.findOne({email});
       if(findByEmail){
        return res.status(400).json({message:"Email Already Exist!"});
       }

       const findByUserName = await User.findOne({userName});
       if(findByUserName){
        return res.status(400).json({message:"UserName Already Exist!"});
       }

       const hashedPassword = await bcrypt.hash(password,10);

       const user = await User.create({
        name,
        email,
        password: hashedPassword,
        userName
       });

    }catch(error){

    }
}