import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData, setUserData, toggleFollow } from '../redux/userSlice';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiGrid } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa6";
import dp from "../assets/dp.jfif";
import Nav from '../components/Nav';
import Post from '../components/Post';

function Profile() {

    const { userName } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profileData, userData, following } = useSelector(state => state.user);
    const { postData } = useSelector(state => state.post);
    const [activeTab, setActiveTab] = useState("posts");

    const isOwnProfile = profileData?._id === userData?._id;
    const userPosts = postData?.filter(post => post.author?._id === profileData?._id);
    const savedPosts = postData?.filter(post => userData?.saved?.includes(post._id));
    const visiblePosts = activeTab === "saved" ? savedPosts : userPosts;

    const handleProfile = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/profile/${userName}`, { withCredentials: true });
            dispatch(setProfileData(response.data));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleProfile();
        setActiveTab("posts");
    }, [userName, dispatch])

    const isFollowing = following.includes(profileData?._id);

    //keeps the overlapping stack spacing for the first 3 avatars
    const stackPosition = ["", "absolute left-2.5", "absolute left-5"];

    const handleFollow = async () => {
        const targetId = profileData?._id;
        dispatch(toggleFollow(targetId));
        try {
            const response = await axios.get(`${serverUrl}/api/user/follow/${targetId}`, { withCredentials: true });
            dispatch(setProfileData(response.data.targetUser));
        } catch (error) {
            dispatch(toggleFollow(targetId));
            console.log(error);
        }
    }

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
                            {profileData?.followers?.slice(0, 3).map((user, index) =>
                                <div
                                    key={user._id || index}
                                    className={`w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden ${stackPosition[index]}`}
                                    onClick={() => navigate(`/profile/${user.userName}`)}
                                >
                                    <img src={user.profileImage || dp} className='w-full h-full object-cover' />
                                </div>
                            )}
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
                            {profileData?.following?.slice(0, 3).map((user, index) =>
                                <div
                                    key={user._id || index}
                                    className={`w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden ${stackPosition[index]}`}
                                    onClick={() => navigate(`/profile/${user.userName}`)}
                                >
                                    <img src={user.profileImage || dp} className='w-full h-full object-cover' />
                                </div>
                            )}
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
             <button className='px-2.5 min-w-40 py-1 h-10 bg-white cursor-pointer rounded-2xl' onClick={handleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button className='px-2.5 min-w-40 py-1 h-10 bg-white cursor-pointer rounded-2xl'>
                Message
            </button>
            </>}
            </div>
            
            <div className='w-full min-h-screen flex justify-center'>
                <div className='w-full max-w-225 flex flex-col items-center bg-white rounded-t-[30px] relative pt-5 gap-5 pb-30'>

                 <Nav/>

                 {isOwnProfile &&
                 <div className='w-full flex items-center justify-center gap-15 border-b border-gray-200 pb-2.5'>
                    <div
                        className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 ${activeTab === "posts" ? "text-black font-semibold border-b-2 border-black" : "text-gray-400"}`}
                        onClick={() => setActiveTab("posts")}
                    >
                        <FiGrid className='w-5 h-5'/>
                        <span>Posts</span>
                    </div>
                    <div
                        className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 ${activeTab === "saved" ? "text-black font-semibold border-b-2 border-black" : "text-gray-400"}`}
                        onClick={() => setActiveTab("saved")}
                    >
                        <FaRegBookmark className='w-4 h-4'/>
                        <span>Saved</span>
                    </div>
                 </div>}

                 {visiblePosts?.map((post, index) =>
                    <Post postData={post} key={index} />
                 )}
                 {activeTab === "saved" && visiblePosts?.length === 0 &&
                    <div className='text-gray-400 py-10'>No saved posts yet</div>}
                 </div>
            </div>
        </div>
    )
}

export default Profile