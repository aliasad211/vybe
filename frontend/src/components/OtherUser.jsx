import React from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import dp from "../assets/dp.jfif"
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { toggleFollow } from '../redux/userSlice';

function OtherUser({ user }) {
  const { following } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFollowing = following.includes(user._id);

  const handleFollow = async () => {
    dispatch(toggleFollow(user._id));
    try {
      await axios.get(`${serverUrl}/api/user/follow/${user._id}`, { withCredentials: true });
    } catch (error) {
      dispatch(toggleFollow(user._id));
      console.log(error);
    }
  }

  return (
    <div className='flex w-full items-center justify-between gap-3'>
      <div className='flex min-w-0 items-center gap-3'>
        <div className='size-10 shrink-0 cursor-pointer overflow-hidden rounded-full ring-1 ring-border'
          onClick={() => navigate(`/profile/${user.userName}`)}>
          <img src={user.profileImage || dp} className='size-full object-cover' />
        </div>
        <div className='min-w-0 cursor-pointer' onClick={() => navigate(`/profile/${user.userName}`)}>
          <div className='truncate text-sm font-semibold text-foreground'>{user.userName}</div>
          <div className='mt-0.5 truncate text-[11px] text-muted-foreground'>{user.name}</div>
        </div>
      </div>
      <button
        className={`h-7 shrink-0 rounded-full px-3 text-[11px] font-semibold transition ${isFollowing
          ? "border border-border text-muted-foreground hover:text-foreground"
          : "bg-primary text-primary-foreground hover:opacity-90"}`}
        onClick={handleFollow}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  )
}

export default OtherUser
