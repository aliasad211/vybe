import React, { useState } from 'react'
import axios from 'axios';
import dp from "../assets/dp.jfif";
import VideoPlayer from '../components/VideoPlayer';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineInsertComment } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData, toggleFollow } from '../redux/userSlice';

function Post({ postData }) {
  const { userData, following } = useSelector(state => state.user);
  const allPosts = useSelector(state => state.post.postData);
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/post/like/${postData._id}`, { withCredentials: true });
      dispatch(setPostData(allPosts.map(p => p._id === response.data._id ? response.data : p)));
    } catch (error) {
      console.log(error);
    }
  }

  const authorId = postData.author?._id;
  const isFollowing = following.includes(authorId);
  const isOwnPost = authorId === userData._id;

  const handleFollow = async () => {
    dispatch(toggleFollow(authorId));
    try {
      await axios.get(`${serverUrl}/api/user/follow/${authorId}`, { withCredentials: true });
    } catch (error) {
      dispatch(toggleFollow(authorId));
      console.log(error);
    }
  }

  const handleSaved = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/post/saved/${postData._id}`, { withCredentials: true });
      dispatch(setUserData(response.data));
    } catch (error) {
      console.log(error);
    }
  }

  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      const response = await axios.post(`${serverUrl}/api/post/comment/${postData._id}`, { message }, { withCredentials: true });
      dispatch(setPostData(allPosts.map(p => p._id === response.data._id ? response.data : p)));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='w-[90%] flex flex-col gap-2.5 bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl'>
      <div className='w-full h-20 flex justify-between items-center px-2.5'>
        <div className='flex justify-center items-center gap-2.5 md:gap-5'>
          <div className='w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${postData.author?.userName}`)}>
            <img src={postData.author?.profileImage || dp} className='w-full h-full object-cover' />
          </div>
          <div className='w-50 font-semibold truncate cursor-pointer' onClick={() => navigate(`/profile/${postData.author?.userName}`)}>
            {postData.author?.userName}
          </div>
        </div>
        {!isOwnPost &&
          <button className='px-2.5 w-20 md:w-25 py-1 h-7 md:h-10 bg-black text-white rounded-2xl text-[14px] md:text-[16px] cursor-pointer' onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>}
      </div>
      <div className='w-[90%] flex flex-col items-center justify-center pb-5'>

        {postData.mediaType === "image" &&
          <div className='w-[90%] h-100 flex items-center justify-center'>
            <img src={postData.media} className='max-w-full max-h-full rounded-2xl object-contain' />
          </div>}

        {postData.mediaType === "video" &&
          <div className='w-[90%] h-100 flex items-center justify-center'>
            <VideoPlayer media={postData.media} />
          </div>}

      </div>
      <div className='w-full h-15 flex justify-between items-center px-5 mt-2.5'>
        <div className='flex justify-center items-center gap-2.5'>
          <div className='flex justify-center items-center gap-1'>
            {!postData.likes?.includes(userData._id) && <GoHeart className='w-6 h-6 cursor-pointer' onClick={handleLike} />}
            {postData.likes?.includes(userData._id) && <GoHeartFill className='w-6 h-6 cursor-pointer text-red-600' onClick={handleLike} />}
            <span>{postData.likes?.length || 0}</span>
          </div>

          <div className='flex justify-center items-center gap-1'>
            <MdOutlineInsertComment className='w-6 h-6 cursor-pointer' onClick={() => setShowComment(prev => !prev)} />
            <span>{postData.comments?.length || 0}</span>
          </div>

        </div>
        <div>
          {!userData.saved?.includes(postData?._id) && <FaRegBookmark className='w-6 h-6 cursor-pointer' onClick={handleSaved}/>}
          {userData.saved?.includes(postData?._id) && <FaBookmark className='w-6 h-6 cursor-pointer' onClick={handleSaved}/>}
        </div>
      </div>

      {postData.caption &&
        <div className='w-full px-5 pb-5 flex gap-2 text-[15px]'>
          <span className='font-semibold shrink-0'>{postData.author?.userName}</span>
          <span className='wrap-break-words'>{postData.caption}</span>
        </div>}

      {showComment &&
        <div className='w-full flex flex-col gap-3 px-5 pb-5'>

          <div className='w-full flex items-center gap-2.5'>
            <div className='w-10 h-10 border-2 border-black rounded-full overflow-hidden shrink-0'>
              <img src={userData.profileImage || dp} className='w-full h-full object-cover' />
            </div>
            <input
              type='text'
              placeholder='Write comment...'
              className='w-full h-10 px-2.5 outline-none border-b-2 border-gray-300'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button className='cursor-pointer disabled:opacity-40' onClick={handleComment} disabled={!message.trim()}>
              <IoSend className='w-5 h-5' />
            </button>
          </div>

          <div className='w-full max-h-50 overflow-auto flex flex-col gap-2.5'>
            {postData.comments?.map((com, index) =>
              <div key={index} className='w-full flex items-center gap-2.5 border-b border-gray-200 pb-1.5'>
                <div className='w-8 h-8 border border-black rounded-full overflow-hidden shrink-0'>
                  <img src={com.author?.profileImage || dp} className='w-full h-full object-cover' />
                </div>
                <span className='font-semibold text-[14px] shrink-0'>{com.author?.userName}</span>
                <span className='text-[14px] wrap-break-words'>{com.message}</span>
              </div>
            )}
          </div>

        </div>
      }

    </div>
  )
}

export default Post