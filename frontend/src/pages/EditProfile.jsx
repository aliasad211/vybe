import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dp from "../assets/dp.jfif";

function EditProfile() {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const imageInput = useRef();
    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
    const [backendImage, setBackendImage] = useState(null);

    const handleImage = (e)=>{
       const file = e.target.files[0];
       setBackendImage(file);
       setFrontendImage(URL.createObjectURL(file));
    }
    return (
        <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5'>
            <div className='w-full h-15 flex items-center gap-5 px-5'>
                <IoIosArrowRoundBack className='text-white cursor-pointer w-7 h-7' onClick={() => navigate(`/profile/${userData.userName}`)} />
                <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
            </div>
            <div className='w-20 h-20 md:w-25 md:h-25 border-2 border-black rounded-full cursor-pointer overflow-hidden'
            onClick={()=>imageInput.current.click()}
            >
                <input type='file' accept='image/*' ref={imageInput} hidden onChange={handleImage}/>
                <img src={frontendImage} className='w-full h-full object-cover' />
            </div>
            <div className='text-blue-500 text-center cursor-pointer text-[16px] font-semibold' onClick={()=>imageInput.current.click()}>
                Change Your Profile Picture
            </div>
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Your Name'/>
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='@UserName'/>
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Bio'/>
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Profession'/>
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Gender'/>
            <button className='px-2.5 w-[60%] max-w-100 py-1 h-13 bg-white cursor-pointer rounded-2xl'>Save Profile</button>
        </div>
    )
}

export default EditProfile