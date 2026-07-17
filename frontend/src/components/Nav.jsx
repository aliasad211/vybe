import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import dp from "../assets/dp.jfif";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();
    const {userData} = useSelector(state=>state.user);
    return (
        <div className='w-[90%] lg:w-[40%] h-20 bg-black flex justify-around items-center fixed bottom-5 rounded-full shadow-2xl shadow-black z-100'>
            <div><GoHomeFill className='text-white w-6 h-6' /></div>
            <div><FiSearch className='text-white w-6 h-6'/></div>
            <div><FiPlusSquare className='text-white w-6 h-6'/></div>
            <div><RxVideo className='text-white w-7 h-7' /></div>
            <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData.userName}`)}>
                <img src={dp} className='w-full h-full object-cover' />
            </div>
            
        </div>
    )
}

export default Nav