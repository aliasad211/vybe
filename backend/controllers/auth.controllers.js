import User from "../models/user.model.js";
import genToken from "../config/token.js";
import bcrypt from "bcryptjs";
import sendMail from "../config/Mail.js";


//signup function
export const signUp=async(req,res)=>{
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

       if(password.length < 6){
        return res.status(400).json({message:"password length must be atleast 6 characters"});
       }

       const hashedPassword = await bcrypt.hash(password,10);

       const user = await User.create({
        name,
        email,
        password: hashedPassword,
        userName
       });

       const token = await genToken(user._id);

       res.cookie("accessToken", token,{
        httpOnly:true,
        maxAge:10*365*24*60*60*1000,
        secure:false,
        sameSite:"Strict"
       })

       return res.status(201).json(user);

    }catch(error){
      return res.status(500).json({message:`signup error ${error}`});
    }
}

//signin function
export const signIn=async(req,res)=>{
    try{
       const {password,userName} =req.body;
       
       const user = await User.findOne({userName});
       if(!user){
        return res.status(400).json({message:"user not found!"});
       }
       
       const isMatch = bcrypt.compare(password, user.password);
       
       if(!isMatch){
        return res.status(400).json({message:"Incorrect Password"});
       }

       const token = await genToken(user._id);

       res.cookie("accessToken", token,{
        httpOnly:true,
        maxAge:10*365*24*60*60*1000,
        secure:false,
        sameSite:"Strict"
       })

       return res.status(200).json(user);

    }catch(error){
      return res.status(500).json({message:`signin error ${error}`});
    }
}

//signout function
export const signOut = async (req,res)=>{
    try{
      res.clearCookie("accessToken",{
        httpOnly:true,
        maxAge:10*365*24*60*60*1000,
        secure:false,
        sameSite:"Strict"
       })

       return res.status(200).json({message:"sign out successfully"})
    }catch(error){
      return res.status(500).json(`sign out error ${error}`);
    }
}

//generate OTP
export const sendOtp = async(req,res)=>{
    try{
       const {email} = req.body;
       const user = User.findOne({email});
       if(!user){
         return res.status(400).json({message:"User Not Found!"});
       }
       const otp = Math.floor(100000 + Math.random() * 900000).toString();
       user.resetOtp = otp;
       user.otpExpires = new Date() + 5*60*1000;
       user.isOtpVerified = false;

       await user.save();
       await sendMail(email,otp);
       
       return res.status(200).json({message:"Email successfully send"});

    }catch(error){
     return res.status(500).json({message:`Send OTP Error ${error}`});
    }
}

//verify otp
export const verifyOtp = async()=>{
    try{
      const {email,otp} = req.body;
      const user = User.findOne({email});

      if(!user || user.resetOtp != otp || user.otpExpires < Date.now()){
        return res.status(400).json({message:"Invalid or Expired OTP"});
      }

      user.isOtpVerified=true;
      user.resetOtp=undefined;
      user.otpExpires=undefined;

      await user.save();

      return res.status(200).json({message:"OTP Verified"});
    }catch(error){
        return res.status(500).json({message:`verify OTP Error ${error}`});
    }
}

//reset password
export const resetPassword = async (req,res)=>{
    try{
       const {email, password} = req.body;
       const user = User.findOne({email});

       if(!user || !user.isOtpVerified){
        return res.status(400).json({message:"otp verification required"});
       }

       const hashedPassword = await bcrypt.hash(password,10);

       user.password = hashedPassword;
       user.isOtpVerified = false;
       await user.save();

       return res.status(200).json({message:"password reset successfully"});
    }catch(error){
        return res.status(500).json({message:`reset password Error ${error}`});
    }
}