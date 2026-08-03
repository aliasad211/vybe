import React from 'react'
import dp from "../assets/dp.jfif";

function Post({ postData }) {
  
  return (
    <div className='w-[90%] min-h-[450px] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl'>
      <div className='w-full h-20 flex justify-between items-center px-2.5'>
        <div className='flex justify-center items-center gap-2.5 md:gap-5'>
        <div className='w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${userData.userName}`)}>
          <img src={postData.author?.profileImage || dp} className='w-full h-full object-cover' />
        </div>
        <div className='w-50 font-semibold truncate'>
          {postData.author?.userName}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Post