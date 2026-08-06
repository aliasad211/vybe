import React from 'react'
import dp from "../assets/dp.jfif";
import { useSelector } from 'react-redux'
import { BiPlusCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

function StoryDp({profileImage, userName, story}) {
    console.log("this is story:", story);
    const navigate = useNavigate();

    const handleClick = ()=>{
        if(!story && userName === "Your Story"){
            navigate("/upload")
        }else{
            navigate("/story")
        }
    }
    return (
        <div className='flex flex-col items-center w-20'>
            <div className={`w-18 h-18 ${story ? "bg-linear-to-b from-blue-500 to-blue-900" : "" } rounded-full flex justify-center items-center relative`} onClick={handleClick}>
            <div className='w-16 h-16 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={ profileImage || dp} className='w-full h-full object-cover' />
            </div>
            {!story && userName == "Your Story" && 
                <div className='absolute bottom-2 right-2'><BiPlusCircle className='w-5 h-5 text-white cursor-pointer'/></div>
                }
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>
              {userName}
            </div>
        </div>
    )
}

export default StoryDp