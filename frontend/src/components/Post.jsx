import React from 'react'
import dp from "../assets/dp.jfif";
import VideoPlayer from '../components/VideoPlayer';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useSelector } from "react-redux";
import { MdOutlineInsertComment } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";

function Post({ postData }) {
  const { userData } = useSelector(state => state.user);
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
      <div className='w-full h-15 flex justify-between items-center px-5 mt-2.5'>
        <div className='flex justify-center items-center gap-2.5'>
          <div className='flex justify-center items-center gap-1'>
            {!postData.likes.includes(userData._id) && <GoHeart className='w-6 h-6 cursor-pointer' />}
            {postData.likes.includes(userData._id) && <GoHeartFill className='w-6 h-6 cursor-pointer text-red-600' />}
            <span>{postData.likes.length}</span>
          </div>

          <div className='flex justify-center items-center gap-1'>
            <MdOutlineInsertComment className='w-6 h-6 cursor-pointer' />
            <span>{postData.comments.length}</span>
          </div>

        </div>
        <div>
          {!userData.saved.includes(postData?._id) && <FaRegBookmark className='w-6 h-6 cursor-pointer'/>}
          {userData.saved.includes(postData?._id) && <FaBookmark className='w-6 h-6 cursor-pointer'/>}
        </div>
      </div>
    </div>
  )
}

export default Post