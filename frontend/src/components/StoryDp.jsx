import React from 'react'
import dp from "../assets/dp.jfif";
import { useSelector } from 'react-redux'

function StoryDp({profileImage, userName}) {
    
    return (
        <div className='flex flex-col w-20'>
            <div className='w-18 h-18 bg-linear-to-b from-blue-500 to-blue-900 rounded-full flex justify-center items-center'>
            <div className='w-16 h-16 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={dp} className='w-full h-full object-cover' />
            </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>
              {userName}
            </div>
        </div>
    )
}

export default StoryDp