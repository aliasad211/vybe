import React from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import dp from "../assets/dp.jfif"
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { toggleFollow } from '../redux/userSlice';

function OtherUser({user}) {
 const {following} = useSelector(state=>state.user);
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const isFollowing = following.includes(user._id);

 const handleFollow = async () => {
   dispatch(toggleFollow(user._id));
   try {
     await axios.get(`${serverUrl}/api/user/follow/${user._id}`, { withCredentials: true });
   } catch (error) {
     dispatch(toggleFollow(user._id));
     console.log(error);
   }
 }

  return (
    <div className='w-full h-20 flex items-center justify-between border-b-2 border-gray-700'>
        <div className='flex justify-center gap-2.5'>
                   <div className='w-13 h-13 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${user.userName}`)}>
                     <img src={user.profileImage || dp} className='w-full h-full object-cover'/>
                   </div>
                   <div className='pt-2'>
                    <div className='text-[18px] text-gray-300 font-semibold'>@{user.userName}</div>
                    <div className='text-[15px] text-gray-400 font-semibold'>{user.name}</div>
                   </div>
                   
                   </div>
                   <button className='px-2.5 w-25 py-1 h-10 bg-white rounded-2xl cursor-pointer' onClick={handleFollow}>{isFollowing ? "Unfollow" : "Follow"}</button>
    </div>
  )
}

export default OtherUser