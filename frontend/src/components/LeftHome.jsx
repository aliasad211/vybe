import React from 'react'
import logo2 from "../assets/logo2.png";
import dp from "../assets/dp.jfif";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';

function LeftHome() {
 const {userData} = useSelector(state=>state.user);
 const dispatch = useDispatch();
 const handleLogOut = async()=>{
    try{
      const response = await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true});
      dispatch(setUserData(null));
    }catch(error){
      console.log(error);
    }
 }
  return (
    <div className='w-[25%] hidden lg:block min-h-screen bg-black border-r-2 border-gray-500'>
        <div className='w-full h-25 flex items-center justify-between p-5'>
            <img src={logo2} alt='' className='w-20'/>
            <div>
               <FaRegHeart  className='text-white w-6 h-6'/>
            </div>
        </div>
        <div className='flex items-center w-full px-5 justify-between gap-2.5'>
            <div className='flex justify-center gap-2.5'>
           <div className='w-17 h-17 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
             <img src={userData.profileImage || dp} className='w-full h-full object-cover'/>
           </div>
           <div>
            <div className='text-[18px] text-gray-300 font-semibold'>@{userData.userName}</div>
            <div className='text-[15px] text-gray-400 font-semibold'>{userData.name}</div>
           </div>
           </div>
           <div className='text-red-400 font-semibold cursor-pointer' onClick={handleLogOut}>Log Out</div>
        </div>
    </div>
  )
}

export default LeftHome