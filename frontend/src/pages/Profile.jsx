import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData, setUserData } from '../redux/userSlice';
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.jfif";
import Nav from '../components/Nav';

function Profile() {

    const { userName } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profileData, userData } = useSelector(state => state.user);

    const handleProfile = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true });
            dispatch(setProfileData(response.data));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleProfile();
    }, [userName, dispatch])

    const handleLogOut = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-full min-h-screen bg-black'>
            <div className='text-white w-full h-20 flex justify-between items-center px-8'>
                <div >
                    <IoIosArrowRoundBack className='text-white cursor-pointer w-7 h-7' onClick={()=>navigate("/")}/>
                </div>
                <div className='font-semibold text-[20px]'>
                    {profileData?.userName}
                </div>
                <div className='font-semibold text-[20px] cursor-pointer text-red-400' onClick={handleLogOut}>
                    Log Out
                </div>
            </div>

            <div className='w-full h-30 flex flex-start gap-5 lg:gap-8 pt-5 px-2.5 justify-center'>
                <div className='w-20 h-20  md:w-17 md:h-17 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || dp} className='w-full h-full object-cover' />
                </div>
                <div>
                    <div className='fonte-semibold text-white text-[22px]'>{profileData?.name}</div>
                    <div className='text-[16px] text-gray-300'>{profileData?.profession || "New User"}</div>
                    <div className='text-[16px] text-gray-300'>{profileData?.bio}</div>
                </div>
            </div>

            <div className='w-full h-20 flex items-center justify-center gap-10 md:gap-15 px-[20%] text-white'>
                <div>
                    <div className='text-white font-semibold text-[22px] md:text-[30px]'>{profileData?.posts?.length}</div>
                    <div className='text-[18px] md:text-[22px] text-gray-300'>Posts</div>
                </div>
                <div>
                    <div className='flex items-center justify-center gap-5'>
                        <div className='flex relative'>
                            <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || dp} className='w-full h-full object-cover' />
                            </div>
                            <div className='w-10 h-10 border-2 border-black rounded-full absolute cursor-pointer overflow-hidden left-2.5'>
                                <img src={profileData?.profileImage || dp} className='w-full h-full object-cover' />
                            </div>
                            <div className='w-10 h-10 border-2 border-black rounded-full absolute cursor-pointer overflow-hidden left-5'>
                                <img src={profileData?.profileImage || dp} className='w-full h-full object-cover' />
                            </div>
                        </div>
                        <div className='text-white font-semibold text-[22px] md:text-[30px]'>
                            {profileData?.followers?.length}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-gray-300'>Followers</div>
                </div>
                <div>
                    <div className='flex items-center justify-center gap-5'>
                        <div className='flex relative'>
                            <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || dp} className='w-full h-full object-cover' />
                            </div>
                            <div className='w-10 h-10 border-2 border-black rounded-full absolute cursor-pointer overflow-hidden left-2.5'>
                                <img src={profileData?.profileImage || dp} className='w-full h-full object-cover' />
                            </div>
                            <div className='w-10 h-10 border-2 border-black rounded-full absolute cursor-pointer overflow-hidden left-5'>
                                <img src={profileData?.profileImage || dp} className='w-full h-full object-cover' />
                            </div>
                        </div>
                        <div className='text-white font-semibold text-[22px] md:text-[30px]'>
                            {profileData?.following?.length}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-gray-300'>Following</div>
                </div>
            </div>

            <div className='w-full h-20 flex justify-center items-center gap-5 mt-2.5'>
             {profileData?._id == userData?._id 
             && 
             <button className='px-2.5 min-w-40 py-1 h-10 bg-white cursor-pointer rounded-2xl' onClick={()=>navigate("/editprofile")}>
                Edit Profile
            </button>}

            {profileData?._id !== userData?._id 
             &&
             <>
             <button className='px-2.5 min-w-40 py-1 h-10 bg-white cursor-pointer rounded-2xl'>
              Follow
            </button>
            <button className='px-2.5 min-w-40 py-1 h-10 bg-white cursor-pointer rounded-2xl'>
                Message
            </button>
            </>}
            </div>
            
            <div className='w-full min-h-screen flex justify-center'>
                <div className='w-full max-w-225 flex flex-col items-center bg-white rounded-t-[30px] relative pt-30 gap-5'>

                 <Nav/>
                 </div>
            </div>
        </div>
    )
}

export default Profile