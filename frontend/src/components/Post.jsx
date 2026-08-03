import React from 'react'
import dp from "../assets/dp.jfif";
import VideoPlayer from '../components/VideoPlayer';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";

function Post({ postData }) {

  return (
    <div className='w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl'>
      <div className='w-full h-20 flex justify-between items-center px-2.5'>
        <div className='flex justify-center items-center gap-2.5 md:gap-5'>
          <div className='w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${userData.userName}`)}>
            <img src={postData.author?.profileImage || dp} className='w-full h-full object-cover' />
          </div>
          <div className='w-50 font-semibold truncate'>
            {postData.author?.userName}
          </div>
        </div>
        <button className='px-[10px] w-15 md:w-25 py-1 h-7 md:h-10 bg-black text-white rounded-2xl text-[14px] md:text-[16px]'>
          Follow
        </button>
      </div>
      <div className='w-[90%] h-full flex flex-col items-center justify-center pb-5'>

        {postData.mediaType === "image" &&
          <div className='w-[90%] flex items-center justify-center'>
            <img src={postData.media} className='h-[100%] rounded-2xl' />


          </div>}

        {postData.mediaType === "video" &&
          <div className='w-[90%] flex items-center justify-center max-w-full object-cover'>
            <VideoPlayer media={postData.media} />


          </div>}

      </div>
      <div className='w-full h-[60px] flex justify-between items-center px-5 mt-2.5'>
        <div>
           <div><GoHeart /> <GoHeartFill /></div>
           <div></div>
        </div>
        <div>

        </div>
      </div>
    </div>
  )
}

export default Post