import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import dp from "../assets/dp.jfif";
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';

function EditProfile() {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const imageInput = useRef();
    const [loading, setLoading] = useState(false);
    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
    const [backendImage, setBackendImage] = useState(null);
    const [name, setName] = useState(userData.name || "");
    const [userName, setUserName] = useState(userData.userName || "");
    const [bio, setBio] = useState(userData.bio || "");
    const [profession, setProfession] = useState(userData.profession || "");
    const [gender, setGender] = useState(userData.gender || "");

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleEditProfile = async () => {
        setLoading(true);
        try {
            const formdata = new FormData()
            formdata.append("name", name)
            formdata.append("userName", userName)
            formdata.append("bio", bio)
            formdata.append("profession", profession)
            formdata.append("gender", gender)
            if (backendImage) {
                formdata.append("profileImage", backendImage);
            }

            const response = await axios.post(`${serverUrl}/api/user/editProfile`, formdata, { withCredentials: true })
            console.log("this response:", response.data);
            dispatch(setProfileData(response.data.user));
            dispatch(setUserData(response.data.user));
            setLoading(false);
            navigate(`/profile/${response.data.user.userName}`);
            
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    return (
        <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5'>
            <div className='w-full h-15 flex items-center gap-5 px-5'>
                <IoIosArrowRoundBack className='text-white cursor-pointer w-7 h-7' onClick={() => navigate(`/profile/${userData.userName}`)} />
                <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
            </div>
            <div className='w-20 h-20 md:w-25 md:h-25 border-2 border-black rounded-full cursor-pointer overflow-hidden'
                onClick={() => imageInput.current.click()}
            >
                <input type='file' accept='image/*' ref={imageInput} hidden onChange={handleImage} />
                <img src={frontendImage} className='w-full h-full object-cover' />
            </div>
            <div className='text-blue-500 text-center cursor-pointer text-[16px] font-semibold' onClick={() => imageInput.current.click()}>
                Change Your Profile Picture
            </div>
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Your Name' onChange={(e) => setName(e.target.value)} value={name} />
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='@UserName' onChange={(e) => setUserName(e.target.value)} value={userName} />
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Bio' onChange={(e) => setBio(e.target.value)} value={bio} />
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Profession' onChange={(e) => setProfession(e.target.value)} value={profession} />
            <input type='text' className='w-[90%] max-w-150 h-15 bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-5 outline-none' placeholder='Gender' onChange={(e) => setGender(e.target.value)} value={gender} />
            <button className='px-2.5 w-[60%] max-w-100 py-1 h-13 bg-white cursor-pointer rounded-2xl' onClick={handleEditProfile} disabled={loading}>{loading ? <ClipLoader size={30} color='black' /> : "Save Profile"}</button>
        </div>
    )
}

export default EditProfile