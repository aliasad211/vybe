import React from 'react'
import { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiPlusSquare } from "react-icons/fi";
import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { ClipLoader } from "react-spinners";

function Upload() {
const[uploadType, setUploadType] = useState("post");
const[fontendMedia, setFrontendMedia] = useState(null);
const[backendMedia, setBackendMedia] = useState(null);
const[mediaType, setMediaType] = useState(null);
const [caption, setCaption] = useState("");
const mediaInput = useRef();
const navigate = useNavigate();
const dispatch = useDispatch();
const {postData} = useSelector(state=>state.post);
const {storyData} = useSelector(state=>state.story);
const {loopData} = useSelector(state=>state.loop);
const [loading, setLoading] = useState(false);

const handleMedia = (e)=>{
   const file = e.target.files[0]

   if(file.type.includes("image")){
    setMediaType("image")
   }else{
    setMediaType("video")
   }
   
   setBackendMedia(file)
   setFrontendMedia(URL.createObjectURL(file))
}

const uploadPost = async()=>{
  setLoading(true);
  try{
    const formData = new FormData();
    formData.append("caption",caption)
    formData.append("mediaType", mediaType)
    formData.append("media",backendMedia)

    const response = await axios.post(`${serverUrl}/api/post/upload`,formData,{withCredentials:true})
    dispatch(setPostData([...postData, response.data]));
    setLoading(false);
    navigate("/");
  }catch(error){
   console.log(error);
  }
}

const uploadStory = async()=>{
  setLoading(true);
  try{
    const formData = new FormData();
    formData.append("mediaType", mediaType)
    formData.append("media",backendMedia)

    const response = await axios.post(`${serverUrl}/api/story/upload`,formData,{withCredentials:true})
    dispatch(setStoryData([...storyData, response.data]));
    setLoading(false);
    navigate("/");
  }catch(error){
   console.log(error);
  }
}

const uploadLoop = async()=>{
  setLoading(true);
  try{
    const formData = new FormData();
    formData.append("caption",caption)
    formData.append("media",backendMedia)

    const response = await axios.post(`${serverUrl}/api/loop/upload`,formData,{withCredentials:true})
    dispatch(setloopData([...loopData, response.data]));
    setLoading(false);
    navigate("/");
  }catch(error){
   console.log(error);
  }
}

const handleUpload = ()=>{
  setLoading(true);
  if(uploadType == "post"){
    uploadPost()
  }else if(uploadType == "story"){
    uploadStory()
  }else{
    uploadLoop()
  }
}
  return (
    <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5'>
                <div className='w-full h-15 flex items-center gap-5 px-5'>
                    <IoIosArrowRoundBack className='text-white cursor-pointer w-7 h-7' onClick={() => navigate("/")} />
                    <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
                </div>

                <div className='w-[90%] max-w-150 h-20 bg-white rounded-full flex justify-around items-center gap-2.5'>
                    <div className={` ${uploadType=="post" ? "bg-black rounded-full text-white cursor-pointer shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={()=>setUploadType("post")}>Post</div>
                    <div className={` ${uploadType=="story" ? "bg-black rounded-full text-white cursor-pointer shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={()=>setUploadType("story")}>Story</div>
                    <div className={`${uploadType=="loop" ? "bg-black rounded-full text-white cursor-pointer shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={()=>setUploadType("loop")}>Loop</div>
                </div>
                
                {!fontendMedia && <div className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-2 mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]'
                 onClick={()=>mediaInput.current.click()} >
                   <input type='file' hidden ref={mediaInput} onChange={handleMedia}/>
                   <FiPlusSquare className='text-white w-6 h-6 cursor-pointer'/>
                    <div className='text-white text-[19px] font-semibold'>upload {uploadType}</div>
                    
                </div> }

                {fontendMedia && 
                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                  
                  {mediaType === "image" && 
                  <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                    <img src={fontendMedia} className='h-[60%] rounded-2xl'/>
                    {uploadType !== "story" && 
                    <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-2 py-1 text-white mt-4'
                    placeholder='white caption'
                    onChange={(e)=>setCaption(e.target.value)}
                    value={caption}
                    />
                    }
                    
                 </div>}

                 {mediaType === "video" && 
                  <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                    <VideoPlayer media={fontendMedia}/>
                    {uploadType !== "story" && 
                    <input type='text' className='w-full border-b-gray-400 border-b-2 outline-none px-2 py-1 text-white mt-4'
                    placeholder='white caption'
                    onChange={(e)=>setCaption(e.target.value)}
                    value={caption}
                    />
                    }
                    
                 </div>}

                </div>}

                {fontendMedia && 
                 <button className='px-[10px] w-[60%] max-w-100 py-1 h-12 bg-white mt-12 cursor-pointer rounded-2xl' onClick={handleUpload}>{loading ? <ClipLoader size={30} color='black' /> : `Upload ${uploadType}`}</button>
                }
                
    </div>
  )
}

export default Upload