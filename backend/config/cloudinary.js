import { v2 as cloudinary } from "cloudinary";

const uploadOnCloudinary=async(file)=>{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
cloudinary.uploader.upload(file,{
    resource_type:'auto'
})
}