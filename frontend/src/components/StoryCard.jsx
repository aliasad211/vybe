import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack, IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io"
import { IoClose } from "react-icons/io5"
import { FaEye } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import dp from "../assets/dp.jfif"
import { posterFor } from './VideoPlayer'

//how long a photo story stays on screen before it advances, in ms
const IMAGE_DURATION = 5000

const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

function StoryCard({ storyData }) {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const videoTag = useRef()

  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [mute, setMute] = useState(true)
  const [showViewers, setShowViewers] = useState(false)
  const [failed, setFailed] = useState(false)

  const isOwnStory = storyData.author?._id === userData?._id
  const isImage = storyData.mediaType === "image"
  //the viewer sheet is a deliberate stop — the story shouldn't tick away behind it
  const holding = paused || showViewers

  //a photo has no clock of its own, so the bar is driven by a rAF loop. deltas
  //rather than a fixed step so it stays honest if a frame is dropped
  useEffect(() => {
    if (!isImage || holding || failed) return
    let raf
    let last = performance.now()

    const tick = (now) => {
      const delta = now - last
      last = now
      setProgress(prev => Math.min(prev + (delta / IMAGE_DURATION) * 100, 100))
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isImage, holding, failed])

  //video keeps its own time, so it only needs pausing in step with the UI
  useEffect(() => {
    const video = videoTag.current
    if (!video) return
    if (holding) {
      video.pause()
    } else {
      video.play().catch(() => {})
    }
  }, [holding])

  //story over — back to the feed, same as tapping the arrow
  useEffect(() => {
    if (progress >= 100) navigate("/")
  }, [progress])

  const handleTimeUpdate = () => {
    const video = videoTag.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const handleError = () => {
    console.error("story media failed to load:", storyData.media)
    setFailed(true)
  }

  return (
    <div className='w-full lg:w-120 h-dvh bg-black relative flex items-center justify-center overflow-hidden'>

      {/* progress bar */}
      <div className='absolute top-2 left-0 w-full px-3 z-30'>
        <div className='w-full h-1 bg-white/30 rounded-full'>
          <div className='h-full bg-white rounded-full' style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* author header */}
      <div className='absolute top-6 left-0 w-full px-3 py-3 flex items-center gap-3 z-30'>
        <IoIosArrowRoundBack className='text-white cursor-pointer w-7 h-7 shrink-0' onClick={() => navigate("/")} />
        <div className='w-9 h-9 border-2 border-white rounded-full overflow-hidden cursor-pointer shrink-0'
          onClick={() => navigate(`/profile/${storyData.author?.userName}`)}>
          <img src={storyData.author?.profileImage || dp} className='w-full h-full object-cover' />
        </div>
        <span className='text-white font-semibold truncate cursor-pointer'
          onClick={() => navigate(`/profile/${storyData.author?.userName}`)}>
          {storyData.author?.userName}
        </span>
        <span className='text-white/70 text-[13px] shrink-0'>{timeAgo(storyData.createdAt)}</span>
      </div>

      {/* media — press and hold anywhere on it to pause */}
      <div
        className='w-full h-full flex items-center justify-center touch-none'
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        {isImage
          ? <img src={storyData.media} className='w-full h-full object-contain' onError={handleError} />
          : <video
              ref={videoTag}
              src={storyData.media}
              poster={posterFor(storyData.media)}
              autoPlay
              muted={mute}
              playsInline
              preload='auto'
              className='w-full h-full object-contain'
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => navigate("/")}
              onError={handleError}
            />}
      </div>

      {failed &&
        <div className='absolute inset-0 flex items-center justify-center text-white text-[14px] bg-black/70 z-20'>
          story could not be loaded
        </div>}

      {!isImage &&
        <div className='absolute bottom-24 right-4 z-30' onClick={() => setMute(prev => !prev)}>
          {mute
            ? <IoMdVolumeOff className='w-6 h-6 text-white cursor-pointer' />
            : <IoMdVolumeHigh className='w-6 h-6 text-white cursor-pointer' />}
        </div>}

      {/* only the author gets to see who watched */}
      {isOwnStory &&
        <div className='absolute bottom-6 left-0 w-full px-5 flex items-center gap-2 z-30 cursor-pointer'
          onClick={() => setShowViewers(true)}>
          <FaEye className='w-5 h-5 text-white' />
          <span className='text-white text-[15px]'>{storyData.viewers?.length || 0}</span>
        </div>}

      {/* viewer sheet */}
      {isOwnStory &&
        <div className={`absolute bottom-0 left-0 w-full h-[55%] bg-white rounded-t-2xl z-40 flex flex-col transition-transform duration-300 ${showViewers ? "translate-y-0" : "translate-y-full"}`}>
          <div className='w-full flex justify-between items-center px-5 py-3 border-b border-gray-200'>
            <span className='font-semibold'>Viewers ({storyData.viewers?.length || 0})</span>
            <IoClose className='w-6 h-6 cursor-pointer' onClick={() => setShowViewers(false)} />
          </div>

          <div className='w-full flex-1 overflow-auto flex flex-col gap-2.5 px-5 py-3'>
            {!storyData.viewers?.length &&
              <div className='w-full text-center text-gray-400 text-[14px] mt-5'>No views yet</div>}
            {storyData.viewers?.map(viewer =>
              <div key={viewer._id} className='w-full flex items-center gap-2.5 border-b border-gray-200 pb-1.5 cursor-pointer'
                onClick={() => navigate(`/profile/${viewer.userName}`)}>
                <div className='w-9 h-9 border border-black rounded-full overflow-hidden shrink-0'>
                  <img src={viewer.profileImage || dp} className='w-full h-full object-cover' />
                </div>
                <span className='font-semibold text-[14px]'>{viewer.userName}</span>
              </div>
            )}
          </div>
        </div>}

    </div>
  )
}

export default StoryCard
