import React from 'react'
import { useSelector } from 'react-redux';
import dp from "../assets/dp.jfif"

function OtherUser({user}) {
 console.log("this is user",user);
 const {userData} = useSelector(state=>state.user);
  return (
    <div className='w-full h-20 flex items-center justify-between border-b-2 border-gray-700'>
        <div className='flex justify-center gap-2.5'>
                   <div className='w-13 h-13 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                     <img src={user.profileImage || dp} className='w-full h-full object-cover'/>
                   </div>
                   <div className='pt-2'>
                    <div className='text-[18px] text-gray-300 font-semibold'>@{user.userName}</div>
                    <div className='text-[15px] text-gray-400 font-semibold'>{user.name}</div>
                   </div>
                   
                   </div>
                   <button className='px-2.5 w-25 py-1 h-10 bg-white rounded-2xl'>Follow</button>
    </div>
  )
}

export default OtherUser