import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import dp from "../assets/dp.jfif"
import { GoHeart, GoHeartFill } from "react-icons/go"
import { MdOutlineInsertComment } from "react-icons/md"
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io"
import { IoSend, IoClose } from "react-icons/io5"
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
  const liked = loopData.likes?.includes(userData._id)

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
    <div ref={cardRef} className='relative flex h-dvh w-full shrink-0 snap-start items-center justify-center overflow-hidden bg-foreground lg:w-[420px]'>

      <video
        ref={videoTag}
        src={loopData.media}
        poster={posterFor(loopData.media)}
        loop
        muted={mute}
        playsInline
        preload='metadata'
        className='size-full object-cover'
        onClick={handleClick}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* keeps the white chrome legible over a bright frame */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/70 to-transparent' />

      {failed &&
        <div className='absolute inset-0 grid place-items-center bg-foreground/80 text-sm text-background'>
          Video could not be loaded
        </div>}

      {burst > 0 &&
        <div key={burst} className='like-burst pointer-events-none absolute inset-0 z-10 grid place-items-center'>
          <GoHeartFill className='size-24 text-background drop-shadow-lg' />
        </div>}

      {/* right action rail */}
      <div className='absolute bottom-32 right-3 z-10 flex flex-col items-center gap-6'>
        <button className='flex flex-col items-center gap-1' onClick={handleLike}>
          {liked
            ? <GoHeartFill className='size-7 text-notification' />
            : <GoHeart className='size-7 text-background' />}
          <span className='text-[11px] font-semibold text-background'>{loopData.likes?.length || 0}</span>
        </button>

        <button className='flex flex-col items-center gap-1' onClick={() => setShowComment(true)}>
          <MdOutlineInsertComment className='size-7 text-background' />
          <span className='text-[11px] font-semibold text-background'>{loopData.comments?.length || 0}</span>
        </button>

        <button aria-label='Toggle sound' onClick={() => setMute(prev => !prev)}>
          {mute
            ? <IoMdVolumeOff className='size-7 text-background' />
            : <IoMdVolumeHigh className='size-7 text-background' />}
        </button>
      </div>

      {/* author + caption */}
      <div className='absolute bottom-24 left-0 z-10 flex w-full flex-col gap-2.5 px-4'>
        <div className='flex items-center gap-2.5'>
          <div className='size-10 shrink-0 cursor-pointer overflow-hidden rounded-full ring-2 ring-background/70'
            onClick={() => navigate(`/profile/${loopData.author?.userName}`)}>
            <img src={loopData.author?.profileImage || dp} className='size-full object-cover' />
          </div>
          <span className='min-w-0 truncate text-sm font-semibold text-background'
            onClick={() => navigate(`/profile/${loopData.author?.userName}`)}>
            {loopData.author?.userName}
          </span>
          {!isOwnLoop &&
            <button
              className={`h-7 shrink-0 rounded-full px-3 text-[11px] font-semibold transition ${isFollowing
                ? "border border-background/60 text-background"
                : "bg-primary text-primary-foreground hover:opacity-90"}`}
              onClick={handleFollow}>
              {isFollowing ? "Following" : "Follow"}
            </button>}
        </div>

        {loopData.caption &&
          <p className='pr-14 text-[13px] leading-5 text-background/90 wrap-break-words'>{loopData.caption}</p>}
      </div>

      {/* progress bar — padded wrapper gives the thin track a usable touch target */}
      <div
        className='absolute bottom-0 left-0 z-10 w-full cursor-pointer touch-none px-3 py-3'
        onPointerDown={handleSeekStart}
        onPointerMove={handleSeekMove}
        onPointerUp={handleSeekEnd}
        onPointerCancel={handleSeekEnd}
      >
        <div ref={barRef} className={`w-full rounded-full bg-background/30 transition-all duration-150 ${seeking ? "h-1.5" : "h-1"}`}>
          <div className='h-full rounded-full bg-background' style={{ width: `${progress}%` }}>
            {seeking &&
              <div className='float-right -mr-1.5 -mt-0.75 size-3 rounded-full bg-background' />}
          </div>
        </div>
      </div>

      {/* comment sheet */}
      <div className={`absolute bottom-0 left-0 z-20 flex h-[55%] w-full flex-col rounded-t-2xl bg-card transition-transform duration-300 ${showComment ? "translate-y-0" : "translate-y-full"}`}>
        <div className='flex items-center justify-between border-b border-border/70 px-5 py-3.5'>
          <span className='font-display text-sm font-semibold text-foreground'>Comments ({loopData.comments?.length || 0})</span>
          <button aria-label='Close'
            className='grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
            onClick={() => setShowComment(false)}>
            <IoClose className='size-5' />
          </button>
        </div>

        <div className='flex flex-1 flex-col gap-3 overflow-auto px-5 py-4 hide-scrollbar'>
          {!loopData.comments?.length &&
            <p className='pt-4 text-center text-xs text-muted-foreground'>No comments yet</p>}
          {loopData.comments?.map((com, index) =>
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

        <div className='flex items-center gap-2.5 border-t border-border/70 px-5 py-3.5'>
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
      </div>

    </div>
  )
}

export default LoopCard
