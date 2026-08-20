import React, { useState } from 'react'
import axios from 'axios';
import dp from "../assets/dp.jfif";
import VideoPlayer from '../components/VideoPlayer';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineInsertComment } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
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

  const liked = postData.likes?.includes(userData._id);
  const saved = userData.saved?.includes(postData?._id);
  const goToAuthor = () => navigate(`/profile/${postData.author?.userName}`);

  return (
    <article className='w-full max-w-[560px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_10px_35px_-28px_var(--shadow-color)]'>

      <header className='flex items-center justify-between gap-3 px-4 py-3.5'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='size-10 shrink-0 cursor-pointer overflow-hidden rounded-full ring-1 ring-border' onClick={goToAuthor}>
            <img src={postData.author?.profileImage || dp} className='size-full object-cover' />
          </div>
          <div className='min-w-0 cursor-pointer' onClick={goToAuthor}>
            <div className='truncate text-sm font-semibold text-foreground'>{postData.author?.userName}</div>
            <div className='mt-0.5 truncate text-[11px] text-muted-foreground'>{postData.author?.name}</div>
          </div>
        </div>
        {!isOwnPost &&
          <button
            className={`h-7 shrink-0 rounded-full px-3 text-[11px] font-semibold transition ${isFollowing
              ? "border border-border text-muted-foreground hover:text-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90"}`}
            onClick={handleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>}
      </header>

      <div className='relative aspect-[4/5] w-full overflow-hidden bg-muted'>
        {postData.mediaType === "image" &&
          <img src={postData.media} className='size-full object-cover' />}
        {postData.mediaType === "video" &&
          <VideoPlayer media={postData.media} />}
      </div>

      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-4'>
          <button className='flex items-center gap-1.5 text-muted-foreground transition hover:text-foreground' onClick={handleLike}>
            {liked
              ? <GoHeartFill className='size-5 text-notification' />
              : <GoHeart className='size-5' />}
            <span className={`text-xs font-semibold ${liked ? "text-foreground" : ""}`}>{postData.likes?.length || 0}</span>
          </button>

          <button className='flex items-center gap-1.5 text-muted-foreground transition hover:text-foreground' onClick={() => setShowComment(prev => !prev)}>
            <MdOutlineInsertComment className='size-5' />
            <span className='text-xs font-semibold'>{postData.comments?.length || 0}</span>
          </button>
        </div>

        <button className='text-muted-foreground transition hover:text-foreground' onClick={handleSaved}>
          {saved ? <FaBookmark className='size-4 text-primary' /> : <FaRegBookmark className='size-4' />}
        </button>
      </div>

      {postData.caption &&
        <p className='px-4 pb-4 text-[15px] leading-6 text-foreground'>
          <span className='mr-1.5 font-semibold'>{postData.author?.userName}</span>
          {postData.caption}
        </p>}

      {showComment &&
        <div className='border-t border-border/70 px-4 py-3.5'>

          <div className='flex items-center gap-2.5'>
            <div className='size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border'>
              <img src={userData.profileImage || dp} className='size-full object-cover' />
            </div>
            <input
              type='text'
              placeholder='Write a comment...'
              className='h-9 min-w-0 flex-1 rounded-full bg-muted px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button className='grid size-9 shrink-0 place-items-center rounded-full text-primary transition hover:bg-accent disabled:opacity-40'
              onClick={handleComment} disabled={!message.trim()}>
              <IoSend className='size-4' />
            </button>
          </div>

          <div className='mt-3.5 flex max-h-52 flex-col gap-3 overflow-auto hide-scrollbar'>
            {!postData.comments?.length &&
              <p className='px-1 text-[11px] text-muted-foreground'>No comments yet.</p>}
            {postData.comments?.map((com, index) =>
              <div key={index} className='flex items-start gap-2.5'>
                <div className='size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border'>
                  <img src={com.author?.profileImage || dp} className='size-full object-cover' />
                </div>
                <p className='min-w-0 text-[13px] leading-5 text-foreground'>
                  <span className='mr-1.5 font-semibold'>{com.author?.userName}</span>
                  {com.message}
                </p>
              </div>
            )}
          </div>

        </div>}

    </article>
  )
}

export default Post
