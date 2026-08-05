import React, { useEffect, useRef, useState } from 'react'
import { IoMdVolumeHigh } from "react-icons/io";
import { IoMdVolumeOff } from "react-icons/io";

// cloudinary can render a frame of the video as a jpg, which loads in a fraction of
// the time the video does — without it the box sits blank while the mp4 buffers
export const posterFor = (url) =>
  typeof url === "string" && url.includes("/video/upload/")
    ? url.replace("/video/upload/", "/video/upload/so_1/").replace(/\.[a-zA-Z0-9]+$/, ".jpg")
    : undefined;

function VideoPlayer({media}) {
  const videoTag = useRef();
  const [mute,setMute] = useState(true);
  const [isPlaying,setIsPlaying] = useState(true);

  const [failed,setFailed] = useState(false);

  // react sets muted as a property, but chrome reads the attribute before allowing
  // autoplay, so kick it off by hand and fall back to a paused first frame
  useEffect(()=>{
    const video = videoTag.current
    if(!video || !media) return
    setFailed(false)
    video.muted = true
    video.play().catch(()=>setIsPlaying(false))
  },[media])

  const handleClick = ()=>{
    const video = videoTag.current
    if(!video || !media) return
    if(isPlaying){
      video.pause()
      setIsPlaying(false)
    }else{
      // a source the browser gave up on rejects with NotSupportedError, so never
      // let this escape as an unhandled rejection
      video.play().then(()=>setIsPlaying(true)).catch(()=>setIsPlaying(false))
    }
  }

  const handleError = ()=>{
    const err = videoTag.current?.error
    console.error("video failed to load:", media, err && { code: err.code, message: err.message })
    setFailed(true)
    setIsPlaying(false)
  }

  if(!media) return null

  return (
    <div className='w-full h-full relative cursor-pointer rounded-2xl overflow-hidden'>
        <video src={media} ref={videoTag} poster={posterFor(media)} autoPlay loop muted={mute} playsInline preload='auto' className='w-full h-full object-cover bg-black' onClick={handleClick} onError={handleError}/>

        {failed &&
          <div className='absolute inset-0 flex items-center justify-center text-white text-[14px] bg-black/70'>
            video could not be loaded
          </div>}

        <div className='absolute bottom-3 right-3' onClick={()=>setMute(prev => !prev)}>
          {!mute ? <IoMdVolumeHigh className='w-5 h-5 text-white font-semibold' /> : <IoMdVolumeOff className='w-5 h-5 text-white font-semibold'/> }
        </div>

    </div>
  )
}

export default VideoPlayer
