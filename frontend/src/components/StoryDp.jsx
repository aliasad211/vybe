import React from 'react'
import dp from "../assets/dp.jfif";
import { useSelector } from 'react-redux'
import { BiPlusCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

function StoryDp({profileImage, userName, story}) {
    const navigate = useNavigate();
    const {userData} = useSelector(state=>state.user);

    const isOwn = userName === "Your Story";

    //viewers come back populated, but fall back to a raw id in case they don't
    const seen = !isOwn && story?.viewers?.some(
        viewer => (viewer?._id || viewer)?.toString() === userData?._id
    );

    const handleClick = ()=>{
        if(isOwn){
            //no story yet — the ring doubles as the "add story" button
            navigate(story ? `/story/${userData?.userName}` : "/upload")
        }else{
            navigate(`/story/${userName}`)
        }
    }

    //an unseen story gets the bright ring, a seen one fades to grey
    const ring = !story
        ? ""
        : seen
            ? "bg-linear-to-b from-gray-500 to-gray-700"
            : "bg-linear-to-b from-blue-500 to-blue-900"

    return (
        <div className='flex flex-col items-center w-20 shrink-0'>
            <div className={`w-18 h-18 ${ring} rounded-full flex justify-center items-center relative`} onClick={handleClick}>
            <div className='w-16 h-16 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={ profileImage || dp} className='w-full h-full object-cover' />
            </div>
            {!story && isOwn &&
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
