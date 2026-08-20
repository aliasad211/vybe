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
      video.play().catch(() => { })
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
    <div className='relative flex h-dvh w-full items-center justify-center overflow-hidden bg-foreground lg:w-[420px] lg:rounded-2xl'>

      {/* progress bar */}
      <div className='absolute left-0 top-2.5 z-30 w-full px-3'>
        <div className='h-1 w-full rounded-full bg-background/25'>
          <div className='h-full rounded-full bg-background transition-[width] duration-100 ease-linear' style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* author header */}
      <div className='absolute left-0 top-6 z-30 flex w-full items-center gap-3 px-3 py-3'>
        <button aria-label='Back'
          className='grid size-8 shrink-0 place-items-center rounded-full text-background/80 transition hover:bg-background/10 hover:text-background'
          onClick={() => navigate("/")}>
          <IoIosArrowRoundBack className='size-6' />
        </button>
        <div className='size-9 shrink-0 cursor-pointer overflow-hidden rounded-full ring-2 ring-background/70'
          onClick={() => navigate(`/profile/${storyData.author?.userName}`)}>
          <img src={storyData.author?.profileImage || dp} className='size-full object-cover' />
        </div>
        <span className='min-w-0 truncate text-sm font-semibold text-background'
          onClick={() => navigate(`/profile/${storyData.author?.userName}`)}>
          {storyData.author?.userName}
        </span>
        <span className='shrink-0 text-[11px] text-background/60'>{timeAgo(storyData.createdAt)}</span>
      </div>

      {/* media — press and hold anywhere on it to pause */}
      <div
        className='flex size-full touch-none items-center justify-center'
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        {isImage
          ? <img src={storyData.media} className='size-full object-contain' onError={handleError} />
          : <video
            ref={videoTag}
            src={storyData.media}
            poster={posterFor(storyData.media)}
            autoPlay
            muted={mute}
            playsInline
            preload='auto'
            className='size-full object-contain'
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => navigate("/")}
            onError={handleError}
          />}
      </div>

      {failed &&
        <div className='absolute inset-0 z-20 grid place-items-center bg-foreground/80 text-sm text-background'>
          Story could not be loaded
        </div>}

      {!isImage &&
        <button aria-label='Toggle sound'
          className='absolute bottom-24 right-4 z-30 grid size-9 place-items-center rounded-full bg-background/15 text-background backdrop-blur transition hover:bg-background/25'
          onClick={() => setMute(prev => !prev)}>
          {mute ? <IoMdVolumeOff className='size-5' /> : <IoMdVolumeHigh className='size-5' />}
        </button>}

      {/* only the author gets to see who watched */}
      {isOwnStory &&
        <button className='absolute bottom-6 left-0 z-30 flex w-full items-center gap-2 px-5 text-background'
          onClick={() => setShowViewers(true)}>
          <FaEye className='size-4' />
          <span className='text-sm font-semibold'>{storyData.viewers?.length || 0}</span>
        </button>}

      {/* viewer sheet */}
      {isOwnStory &&
        <div className={`absolute bottom-0 left-0 z-40 flex h-[55%] w-full flex-col rounded-t-2xl bg-card transition-transform duration-300 ${showViewers ? "translate-y-0" : "translate-y-full"}`}>
          <div className='flex items-center justify-between border-b border-border/70 px-5 py-3.5'>
            <span className='font-display text-sm font-semibold text-foreground'>Viewers ({storyData.viewers?.length || 0})</span>
            <button aria-label='Close'
              className='grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
              onClick={() => setShowViewers(false)}>
              <IoClose className='size-5' />
            </button>
          </div>

          <div className='flex flex-1 flex-col gap-3 overflow-auto px-5 py-4 hide-scrollbar'>
            {!storyData.viewers?.length &&
              <p className='pt-4 text-center text-xs text-muted-foreground'>No views yet</p>}
            {storyData.viewers?.map(viewer =>
              <button key={viewer._id} className='flex items-center gap-3 text-left'
                onClick={() => navigate(`/profile/${viewer.userName}`)}>
                <div className='size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border'>
                  <img src={viewer.profileImage || dp} className='size-full object-cover' />
                </div>
                <div className='min-w-0'>
                  <div className='truncate text-sm font-semibold text-foreground'>{viewer.userName}</div>
                  <div className='mt-0.5 truncate text-[11px] text-muted-foreground'>{viewer.name}</div>
                </div>
              </button>
            )}
          </div>
        </div>}

    </div>
  )
}

export default StoryCard
