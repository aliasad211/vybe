import React, { useRef, useState } from 'react'
import { IoMdVolumeHigh } from "react-icons/io";
import { IoMdVolumeOff } from "react-icons/io";

function VideoPlayer({media}) {
  const videoTag = useRef();
  const [mute,setMute] = useState(false);
  const [isPlaying,setIsPlaying] = useState(true);

  const handleClick = ()=>{
    if(isPlaying){
      videoTag.current.pause()
      setIsPlaying(false)
    }else{
      videoTag.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
        <video src={media} ref={videoTag} autoPlay loop muted={mute} className='h-[100%] relative cursor-pointer max-w-full rounded-2xl object-cover' onClick={handleClick}/>
        
        <div className='absolute bottom-3 right-3' onClick={()=>setMute(prev => !prev)}>
          {!mute ? <IoMdVolumeHigh className='w-5 h-5 text-white font-semibold' /> : <IoMdVolumeOff className='w-5 h-5 text-white font-semibold'/> }
        </div>
        
    </div>
  )
}

export default VideoPlayer