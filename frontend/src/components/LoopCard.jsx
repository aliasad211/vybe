import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import dp from "../assets/dp.jfif"
import { GoHeart, GoHeartFill } from "react-icons/go"
import { MdOutlineInsertComment } from "react-icons/md"
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io"
import { IoSend } from "react-icons/io5"
import { IoClose } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { serverUrl } from '../App'
import { setLoopData } from '../redux/loopSlice'
import { toggleFollow } from '../redux/userSlice'
import { posterFor } from './VideoPlayer'

function LoopCard({ loopData }) {
  const { userData, following } = useSelector(state => state.user)
  const allLoops = useSelector(state => state.loop.loopData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const videoTag = useRef()
  const cardRef = useRef()
  const barRef = useRef()

  const [mute, setMute] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [message, setMessage] = useState("")
  const [progress, setProgress] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [burst, setBurst] = useState(0)   // bumped on every double tap; 0 = hidden

  const clickTimer = useRef(null)
  const burstTimer = useRef(null)

  // only the loop the user has scrolled to should play — otherwise every video in
  // the feed runs at once and fights for bandwidth
  useEffect(() => {
    const card = cardRef.current
    const video = videoTag.current
    if (!card || !video) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.muted = true
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      } else {
        video.pause()
        video.currentTime = 0
        setIsPlaying(false)
        setProgress(0)
      }
    }, { threshold: 0.6 })

    observer.observe(card)
    return () => observer.disconnect()
  }, [loopData.media])

  useEffect(() => () => {
    clearTimeout(clickTimer.current)
    clearTimeout(burstTimer.current)
  }, [])

  const togglePlay = () => {
    const video = videoTag.current
    if (!video) return
    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  const handleDoubleTap = () => {
    setBurst(prev => prev + 1)
    clearTimeout(burstTimer.current)
    burstTimer.current = setTimeout(() => setBurst(0), 900)
    // the like endpoint is a toggle — a double tap should only ever like, never unlike
    if (!loopData.likes?.includes(userData._id)) handleLike()
  }

  // hold the play/pause a moment: if a second tap lands it was a double tap (like), not a pause
  const handleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      handleDoubleTap()
      return
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      togglePlay()
    }, 250)
  }

  const handleTimeUpdate = () => {
    const video = videoTag.current
    // while scrubbing the bar follows the pointer, not the (lagging) video clock
    if (!video || !video.duration || seeking) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const seekTo = (clientX) => {
    const bar = barRef.current
    const video = videoTag.current
    if (!bar || !video || !video.duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    video.currentTime = ratio * video.duration
    setProgress(ratio * 100)
  }

  // pointer capture so a drag that wanders off the thin bar keeps scrubbing
  const handleSeekStart = (e) => {
    setSeeking(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    seekTo(e.clientX)
  }

  const handleSeekMove = (e) => {
    if (seeking) seekTo(e.clientX)
  }

  const handleSeekEnd = (e) => {
    if (!seeking) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    setSeeking(false)
  }

  const handleError = () => {
    console.error("loop video failed to load:", loopData.media, videoTag.current?.error)
    setFailed(true)
    setIsPlaying(false)
  }

  const handleLike = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/loop/like/${loopData._id}`, { withCredentials: true })
      dispatch(setLoopData(allLoops.map(l => l._id === response.data._id ? response.data : l)))
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async () => {
    if (!message.trim()) return
    try {
      const response = await axios.post(`${serverUrl}/api/loop/comment/${loopData._id}`, { message }, { withCredentials: true })
      dispatch(setLoopData(allLoops.map(l => l._id === response.data._id ? response.data : l)))
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  const authorId = loopData.author?._id
  const isFollowing = following.includes(authorId)
  const isOwnLoop = authorId === userData._id

  const handleFollow = async () => {
    dispatch(toggleFollow(authorId))
    try {
      await axios.get(`${serverUrl}/api/user/follow/${authorId}`, { withCredentials: true })
    } catch (error) {
      dispatch(toggleFollow(authorId))
      console.log(error)
    }
  }

  return (
    <div ref={cardRef} className='w-full lg:w-[480px] h-[100dvh] shrink-0 snap-start relative flex items-center justify-center bg-black border-b border-gray-800 overflow-hidden'>

      <video
        ref={videoTag}
        src={loopData.media}
        poster={posterFor(loopData.media)}
        loop
        muted={mute}
        playsInline
        preload='metadata'
        className='w-full h-full object-cover'
        onClick={handleClick}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
      />

      {failed &&
        <div className='absolute inset-0 flex items-center justify-center text-white text-[14px] bg-black/70'>
          video could not be loaded
        </div>}

      {burst > 0 &&
        <div key={burst} className='like-burst absolute inset-0 flex items-center justify-center pointer-events-none z-10'>
          <GoHeartFill className='w-24 h-24 text-white drop-shadow-lg' />
        </div>}

      {/* right action rail */}
      <div className='absolute right-3 bottom-32 flex flex-col items-center gap-6 z-10'>
        <div className='flex flex-col items-center gap-1'>
          {loopData.likes?.includes(userData._id)
            ? <GoHeartFill className='w-7 h-7 text-red-600 cursor-pointer' onClick={handleLike} />
            : <GoHeart className='w-7 h-7 text-white cursor-pointer' onClick={handleLike} />}
          <span className='text-white text-[13px]'>{loopData.likes?.length || 0}</span>
        </div>

        <div className='flex flex-col items-center gap-1'>
          <MdOutlineInsertComment className='w-7 h-7 text-white cursor-pointer' onClick={() => setShowComment(true)} />
          <span className='text-white text-[13px]'>{loopData.comments?.length || 0}</span>
        </div>

        <div onClick={() => setMute(prev => !prev)}>
          {mute
            ? <IoMdVolumeOff className='w-7 h-7 text-white cursor-pointer' />
            : <IoMdVolumeHigh className='w-7 h-7 text-white cursor-pointer' />}
        </div>
      </div>

      {/* author + caption */}
      <div className='absolute bottom-24 left-0 w-full px-4 flex flex-col gap-2.5 z-10'>
        <div className='flex items-center gap-2.5'>
          <div className='w-10 h-10 border-2 border-white rounded-full cursor-pointer overflow-hidden shrink-0' onClick={() => navigate(`/profile/${loopData.author?.userName}`)}>
            <img src={loopData.author?.profileImage || dp} className='w-full h-full object-cover' />
          </div>
          <span className='text-white font-semibold truncate cursor-pointer' onClick={() => navigate(`/profile/${loopData.author?.userName}`)}>
            {loopData.author?.userName}
          </span>
          {!isOwnLoop &&
            <button className='px-3 py-1 border border-white text-white rounded-2xl text-[13px] cursor-pointer' onClick={handleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>}
        </div>

        {loopData.caption &&
          <div className='text-white text-[15px] break-words pr-14'>{loopData.caption}</div>}
      </div>

      {/* progress bar — padded wrapper gives the thin track a usable touch target */}
      <div
        className='absolute bottom-0 left-0 w-full px-3 py-3 z-10 cursor-pointer touch-none'
        onPointerDown={handleSeekStart}
        onPointerMove={handleSeekMove}
        onPointerUp={handleSeekEnd}
        onPointerCancel={handleSeekEnd}
      >
        <div ref={barRef} className={`w-full bg-white/30 rounded-full transition-all duration-150 ${seeking ? "h-1.5" : "h-1"}`}>
          <div className='h-full bg-white rounded-full' style={{ width: `${progress}%` }}>
            {seeking &&
              <div className='w-3 h-3 bg-white rounded-full -mt-[3px] -mr-1.5 float-right' />}
          </div>
        </div>
      </div>

      {/* comment sheet */}
      <div className={`absolute bottom-0 left-0 w-full h-[55%] bg-white rounded-t-2xl z-20 flex flex-col transition-transform duration-300 ${showComment ? "translate-y-0" : "translate-y-full"}`}>
        <div className='w-full flex justify-between items-center px-5 py-3 border-b border-gray-200'>
          <span className='font-semibold'>Comments ({loopData.comments?.length || 0})</span>
          <IoClose className='w-6 h-6 cursor-pointer' onClick={() => setShowComment(false)} />
        </div>

        <div className='w-full flex-1 overflow-auto flex flex-col gap-2.5 px-5 py-3'>
          {loopData.comments?.length === 0 &&
            <div className='w-full text-center text-gray-400 text-[14px] mt-5'>No comments yet</div>}
          {loopData.comments?.map((com, index) =>
            <div key={index} className='w-full flex items-center gap-2.5 border-b border-gray-200 pb-1.5'>
              <div className='w-8 h-8 border border-black rounded-full overflow-hidden shrink-0'>
                <img src={com.author?.profileImage || dp} className='w-full h-full object-cover' />
              </div>
              <span className='font-semibold text-[14px] shrink-0'>{com.author?.userName}</span>
              <span className='text-[14px] break-words'>{com.message}</span>
            </div>
          )}
        </div>

        <div className='w-full flex items-center gap-2.5 px-5 py-3 border-t border-gray-200'>
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
      </div>

    </div>
  )
}

export default LoopCard
