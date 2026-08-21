import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Avatar from './Avatar'
import { GoHeart, GoHeartFill } from "react-icons/go"
import { MdOutlineInsertComment } from "react-icons/md"
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io"
import { IoSend, IoClose } from "react-icons/io5"
import { FiPlay, FiPause, FiBookmark } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { serverUrl } from '../App'
import { setLoopData } from '../redux/loopSlice'
import { toggleFollow } from '../redux/userSlice'
import { posterFor } from './VideoPlayer'

const duration = (seconds) => {
  if (!seconds || !isFinite(seconds)) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

//one rail button: the circle, and the count under it when there is one
function RailButton({ label, value, onClick, children }) {
  return (
    <button type='button' className='flex flex-col items-center gap-1 transition hover:scale-110' aria-label={label} onClick={onClick}>
      <span className='grid size-10 place-items-center rounded-full bg-foreground/35 backdrop-blur'>{children}</span>
      {value !== undefined && <span className='text-[10px] font-semibold'>{value}</span>}
    </button>
  )
}

function LoopCard({ loopData, muted, onToggleMute }) {
  const { userData, following } = useSelector(state => state.user)
  const allLoops = useSelector(state => state.loop.loopData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const videoTag = useRef()
  const cardRef = useRef()

  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [message, setMessage] = useState("")
  const [length, setLength] = useState(null)
  const [progress, setProgress] = useState(0)
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
        video.play().then(() => setPaused(false)).catch(() => setPaused(true))
      } else {
        video.pause()
        video.currentTime = 0
        setPaused(true)
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
    if (video.paused) {
      video.play().then(() => setPaused(false)).catch(() => setPaused(true))
    } else {
      video.pause()
      setPaused(true)
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
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const handleError = () => {
    console.error("loop video failed to load:", loopData.media, videoTag.current?.error)
    setFailed(true)
    setPaused(true)
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
    <article
      ref={cardRef}
      className='relative h-full w-full shrink-0 snap-start overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_24px_60px_-40px_var(--shadow-color)]'
    >
      <video
        ref={videoTag}
        src={loopData.media}
        poster={posterFor(loopData.media)}
        loop
        muted={muted}
        playsInline
        preload='metadata'
        className='size-full object-cover'
        onClick={handleClick}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setLength(duration(e.currentTarget.duration))}
      />

      <div className='pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4'>
        <span className='pointer-events-auto rounded-full bg-foreground/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-background backdrop-blur'>
          Loop{length ? ` · ${length}` : ""}
        </span>
        <button
          type='button'
          className='pointer-events-auto grid size-9 place-items-center rounded-full bg-foreground/45 text-background backdrop-blur'
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={onToggleMute}
        >
          {muted ? <IoMdVolumeOff className='size-4' /> : <IoMdVolumeHigh className='size-4' />}
        </button>
      </div>

      {failed &&
        <div className='absolute inset-0 grid place-items-center bg-foreground/80 text-sm text-background'>
          Video could not be loaded
        </div>}

      {paused && !failed &&
        <div className='pointer-events-none absolute inset-0 grid place-items-center'>
          <span className='grid size-16 place-items-center rounded-full bg-foreground/40 text-background backdrop-blur'>
            <FiPlay className='size-7 fill-current' />
          </span>
        </div>}

      {burst > 0 &&
        <div key={burst} className='like-burst pointer-events-none absolute inset-0 grid place-items-center'>
          <GoHeartFill className='size-24 text-background drop-shadow-lg' />
        </div>}

      <div className='pointer-events-none absolute inset-x-0 bottom-0 flex items-end gap-3 bg-gradient-to-t from-foreground/70 via-foreground/25 to-transparent p-4 pt-16'>
        <div className='pointer-events-auto min-w-0 flex-1 text-background'>
          <div className='mb-2.5 flex items-center gap-2.5'>
            <Avatar
              user={loopData.author}
              size='size-9'
              text='text-[10px]'
              ring='ring-2 ring-background/70'
              onClick={() => navigate(`/profile/${loopData.author?.userName}`)}
            />
            <div className='min-w-0 cursor-pointer' onClick={() => navigate(`/profile/${loopData.author?.userName}`)}>
              <p className='truncate text-sm font-semibold'>{loopData.author?.name || loopData.author?.userName}</p>
              <p className='truncate text-[11px] opacity-80'>@{loopData.author?.userName}</p>
            </div>
            {!isOwnLoop &&
              <button
                className='h-7 shrink-0 rounded-full border border-background/60 bg-transparent px-3 text-[11px] font-semibold text-background transition hover:bg-background/15'
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>}
          </div>

          {loopData.caption &&
            <p className='line-clamp-2 text-[13px] leading-5 break-words'>{loopData.caption}</p>}
        </div>

        <div className='pointer-events-auto flex shrink-0 flex-col items-center gap-4 pb-1 text-background'>
          <RailButton label={liked ? "Unlike" : "Like"} value={loopData.likes?.length || 0} onClick={handleLike}>
            {liked
              ? <GoHeartFill className='size-5 text-notification' />
              : <GoHeart className='size-5' />}
          </RailButton>

          <RailButton label='Comments' value={loopData.comments?.length || 0} onClick={() => setShowComment(true)}>
            <MdOutlineInsertComment className='size-5' />
          </RailButton>

          <RailButton label='Save'>
            <FiBookmark className='size-5' />
          </RailButton>

          <RailButton label={paused ? "Play" : "Pause"} onClick={togglePlay}>
            {paused ? <FiPlay className='size-5' /> : <FiPause className='size-5' />}
          </RailButton>
        </div>
      </div>

      {/* thin progress line along the very bottom of the card */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-background/25'>
        <div className='h-full bg-background' style={{ width: `${progress}%` }} />
      </div>

      <div className={`absolute inset-x-0 bottom-0 z-20 flex h-[62%] flex-col rounded-t-2xl bg-card transition-transform duration-300 ${showComment ? "translate-y-0" : "translate-y-full"}`}>
        <div className='flex items-center justify-between border-b border-border/70 px-5 py-3.5'>
          <span className='font-display text-sm font-semibold text-foreground'>Comments ({loopData.comments?.length || 0})</span>
          <button
            aria-label='Close'
            className='grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
            onClick={() => setShowComment(false)}
          >
            <IoClose className='size-5' />
          </button>
        </div>

        <div className='flex flex-1 flex-col gap-3 overflow-auto px-5 py-4 hide-scrollbar'>
          {!loopData.comments?.length &&
            <p className='pt-4 text-center text-xs text-muted-foreground'>No comments yet</p>}
          {loopData.comments?.map((com, index) =>
            <div key={index} className='flex items-start gap-2.5'>
              <Avatar user={com.author} size='size-8' text='text-[10px]' />
              <p className='min-w-0 text-[13px] leading-5 text-foreground'>
                <span className='mr-1.5 font-semibold'>{com.author?.userName}</span>
                {com.message}
              </p>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2.5 border-t border-border/70 px-5 py-3.5'>
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
      </div>

    </article>
  )
}

export default LoopCard
