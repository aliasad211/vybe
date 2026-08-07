import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import logo2 from "../assets/logo2.png";
import StoryDp from './StoryDp.jsx';
import Nav from './Nav.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Post from './Post.jsx';
export default function Feed() {
    const {postData} = useSelector(state=>state.post);
    const {userData} = useSelector(state=>state.user);
    const {storyData} = useSelector(state=>state.story);
    const {unreadCount} = useSelector(state=>state.notification);
    const navigate = useNavigate();
    return (
        <div className='lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto hide-scrollbar'>
            <div className='lg:hidden md:block w-full h-25 flex items-center justify-between p-5'>
                <img src={logo2} alt='' className='w-20' />
                <div className='relative cursor-pointer' onClick={() => navigate("/notifications")}>
                    <FaRegHeart className='text-white w-6 h-6' />
                    {unreadCount > 0 &&
                        <span className='absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center'>
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>}
                </div>
            </div>

            <div className='flex w-full overflow-auto hide-scrollbar gap-4 p-5'>
              <StoryDp userName={"Your Story"} profileImage={userData.profileImage} story={userData.story}/>
              {storyData?.map(story=>
                <StoryDp
                  key={story._id}
                  userName={story.author?.userName}
                  profileImage={story.author?.profileImage}
                  story={story}
                />
              )}
            </div>

            <div className='w-full min-h-screen flex flex-col items-center gap-5 p-2.5 pt-10 bg-white rounded-t-[60px] relative pb-30'>
               <Nav/>
               {postData?.map((post,index)=>
                <Post postData={post} key={index}/>
               )}
            </div>
        </div>
    )
}
