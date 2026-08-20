import React, { useEffect, useRef, useState } from 'react'
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";

// cloudinary can render a frame of the video as a jpg, which loads in a fraction of
// the time the video does — without it the box sits blank while the mp4 buffers
export const posterFor = (url) =>
  typeof url === "string" && url.includes("/video/upload/")
    ? url.replace("/video/upload/", "/video/upload/so_1/").replace(/\.[a-zA-Z0-9]+$/, ".jpg")
    : undefined;

function VideoPlayer({ media }) {
  const videoTag = useRef();
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const [failed, setFailed] = useState(false);

  // react sets muted as a property, but chrome reads the attribute before allowing
  // autoplay, so kick it off by hand and fall back to a paused first frame
  useEffect(() => {
    const video = videoTag.current
    if (!video || !media) return
    setFailed(false)
    video.muted = true
    video.play().catch(() => setIsPlaying(false))
  }, [media])

  const handleClick = () => {
    const video = videoTag.current
    if (!video || !media) return
    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      // a source the browser gave up on rejects with NotSupportedError, so never
      // let this escape as an unhandled rejection
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  const handleError = () => {
    const err = videoTag.current?.error
    console.error("video failed to load:", media, err && { code: err.code, message: err.message })
    setFailed(true)
    setIsPlaying(false)
  }

  if (!media) return null

  return (
    <div className='relative size-full cursor-pointer overflow-hidden'>
      <video src={media} ref={videoTag} poster={posterFor(media)} autoPlay loop muted={mute} playsInline preload='auto' className='size-full bg-muted object-cover' onClick={handleClick} onError={handleError} />

      {failed &&
        <div className='absolute inset-0 grid place-items-center bg-foreground/70 text-sm text-background'>
          Video could not be loaded
        </div>}

      <button
        aria-label='Toggle sound'
        className='absolute bottom-3 right-3 grid size-8 place-items-center rounded-full bg-foreground/30 text-background backdrop-blur transition hover:bg-foreground/50'
        onClick={(e) => { e.stopPropagation(); setMute(prev => !prev) }}
      >
        {mute ? <IoMdVolumeOff className='size-4' /> : <IoMdVolumeHigh className='size-4' />}
      </button>

    </div>
  )
}

export default VideoPlayer
