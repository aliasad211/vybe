import React, { useState } from 'react'
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import Avatar from './Avatar';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineInsertComment } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData, toggleFollow } from '../redux/userSlice';

const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins} min`
  if (mins < 1440) return `${Math.floor(mins / 60)} hr`
  return `${Math.floor(mins / 1440)}d`
}

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
    <article className='overflow-hidden rounded-lg border border-border/80 bg-card shadow-[0_10px_35px_-28px_var(--shadow-color)]'>

      <div className='flex items-center justify-between px-4 py-4 sm:px-5'>
        <div className='flex min-w-0 items-center gap-3'>
          <Avatar user={postData.author} size='size-10' onClick={goToAuthor} />
          <div className='min-w-0'>
            <h3 className='truncate text-sm font-semibold text-foreground cursor-pointer' onClick={goToAuthor}>
              {postData.author?.name || postData.author?.userName}
            </h3>
            <p className='truncate text-xs text-muted-foreground'>
              @{postData.author?.userName} · {timeAgo(postData.createdAt)}
            </p>
          </div>
        </div>

        {isOwnPost
          ? <button className='grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground' aria-label='More options'>
            <FiMoreHorizontal className='size-4' />
          </button>
          : <button
            className={`h-8 shrink-0 rounded-full px-3 text-xs font-semibold transition ${isFollowing
              ? "border border-border text-muted-foreground hover:text-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
            onClick={handleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>}
      </div>

      <div className='px-4 pb-4 sm:px-5'>
        {postData.caption &&
          <p className='mb-4 text-[15px] leading-6 text-foreground'>{postData.caption}</p>}

        <div className='aspect-square w-full overflow-hidden rounded-lg bg-muted'>
          {postData.mediaType === "image"
            ? <img src={postData.media} className='size-full object-cover' loading='lazy' />
            : <VideoPlayer media={postData.media} />}
        </div>
      </div>

      <div className='flex items-center justify-between border-t border-border/70 px-4 py-3 sm:px-5'>
        <div className='flex items-center gap-1'>
          <button
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition hover:bg-accent ${liked ? "text-notification" : "text-muted-foreground"}`}
            aria-label={liked ? "Unlike post" : "Like post"}
            onClick={handleLike}
          >
            {liked ? <GoHeartFill className='size-4' /> : <GoHeart className='size-4' />}
            {postData.likes?.length || 0}
          </button>

          <button
            className='flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-accent'
            aria-label='Comment on post'
            onClick={() => setShowComment(prev => !prev)}
          >
            <MdOutlineInsertComment className='size-4' />
            {postData.comments?.length || 0}
          </button>
        </div>

        <button
          className={`grid size-8 place-items-center rounded-full transition hover:bg-accent ${saved ? "text-primary" : "text-muted-foreground"}`}
          aria-label={saved ? "Remove bookmark" : "Bookmark post"}
          onClick={handleSaved}
        >
          {saved ? <FaBookmark className='size-4' /> : <FaRegBookmark className='size-4' />}
        </button>
      </div>

      {showComment &&
        <div className='border-t border-border/70 px-4 py-4 sm:px-5'>
          <div className='flex items-center gap-2.5'>
            <Avatar user={userData} size='size-9' />
            <input
              type='text'
              placeholder='Write a comment...'
              className='h-10 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button
              className='grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40'
              onClick={handleComment} disabled={!message.trim()}
            >
              <IoSend className='size-4' />
            </button>
          </div>

          <div className='mt-4 flex max-h-52 flex-col gap-3.5 overflow-auto hide-scrollbar'>
            {!postData.comments?.length &&
              <p className='text-center text-xs text-muted-foreground'>No comments yet.</p>}
            {postData.comments?.map((com, index) =>
              <div key={index} className='flex items-start gap-2.5'>
                <Avatar user={com.author} size='size-8' text='text-[10px]' />
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
