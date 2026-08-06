import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io"
import { ClipLoader } from "react-spinners"
import StoryCard from '../components/StoryCard.jsx'
import { serverUrl } from '../App'
import { setCurrentStory, updateStoryInTray } from '../redux/storySlice.js'

function Story() {
  const { userName } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const { currentStory } = useSelector(state => state.story)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchStory = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${serverUrl}/api/story/getByUserName/${userName}`, { withCredentials: true })
        if (cancelled) return
        //the endpoint returns a list, but a new upload replaces the old story so
        //there is only ever one live entry per user
        dispatch(setCurrentStory(response.data[0] || null))
      } catch (error) {
        console.log(error)
        if (!cancelled) dispatch(setCurrentStory(null))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStory()

    //drop the story on the way out, otherwise the next one opens showing the previous media
    return () => {
      cancelled = true
      dispatch(setCurrentStory(null))
    }
  }, [userName])

  //register the view once the story is loaded — the response carries the updated
  //viewer list, which is what the author sees at the bottom of their own story
  useEffect(() => {
    if (!currentStory?._id) return
    if (currentStory.author?._id === userData?._id) return

    const markViewed = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/story/view/${currentStory._id}`, { withCredentials: true })
        dispatch(setCurrentStory(response.data))
        //feed the updated viewer list back into the tray so the ring goes grey
        //on the way back, without refetching the whole tray
        dispatch(updateStoryInTray(response.data))
      } catch (error) {
        console.log(error)
      }
    }
    markViewed()
  }, [currentStory?._id])

  return (
    <div className='w-full h-dvh bg-black flex justify-center items-center'>
      {loading
        ? <ClipLoader size={30} color='white' />
        : currentStory
          ? <StoryCard storyData={currentStory} />
          : <div className='w-full h-full flex flex-col items-center justify-center gap-5'>
              <div className='w-full h-15 flex items-center gap-5 px-5 fixed top-2.5 left-0'>
                <IoIosArrowRoundBack className='text-white cursor-pointer w-7 h-7' onClick={() => navigate("/")} />
              </div>
              <span className='text-white text-[16px]'>No story to show</span>
            </div>}
    </div>
  )
}

export default Story
