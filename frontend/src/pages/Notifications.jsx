import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io"
import { FaHeart, FaRegComment, FaUserPlus } from "react-icons/fa"
import { serverUrl } from '../App'
import { setNotifications, markAllSeen } from '../redux/notificationSlice'
import { posterFor } from '../components/VideoPlayer'
import dp from '../assets/dp.jfif'

const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}

const typeText = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you"
}

const typeIcon = {
  like: <FaHeart className='text-red-500 w-3 h-3' />,
  comment: <FaRegComment className='text-blue-400 w-3 h-3' />,
  follow: <FaUserPlus className='text-green-400 w-3 h-3' />
}

function Notifications() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notifications } = useSelector(state => state.notification)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/notification`, { withCredentials: true })
        dispatch(setNotifications(response.data))
        await axios.patch(`${serverUrl}/api/notification/seen`, {}, { withCredentials: true })
        dispatch(markAllSeen())
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotifications()
  }, [dispatch])

  return (
    <div className='w-full min-h-screen bg-black text-white'>
      <div className='w-full h-20 flex items-center gap-5 px-5'>
        <IoIosArrowRoundBack className='w-7 h-7 cursor-pointer' onClick={() => navigate("/")} />
        <div className='font-semibold text-[20px]'>Notifications</div>
      </div>

      {notifications?.length === 0 &&
        <div className='text-gray-400 text-center mt-10'>No notifications yet.</div>}

      <div className='w-full flex flex-col'>
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className={`w-full flex items-center gap-3.5 px-5 py-3.5 border-b border-gray-800 cursor-pointer ${!notification.seen ? "bg-gray-900" : ""}`}
            onClick={() => navigate(`/profile/${notification.sender?.userName}`)}
          >
            <div className='relative w-12 h-12 shrink-0'>
              <div className='w-12 h-12 border-2 border-black rounded-full overflow-hidden'>
                <img src={notification.sender?.profileImage || dp} className='w-full h-full object-cover' />
              </div>
              <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-black border border-gray-700 rounded-full flex items-center justify-center'>
                {typeIcon[notification.type]}
              </div>
            </div>

            <div className='flex-1'>
              <span className='font-semibold'>{notification.sender?.userName}</span>{' '}
              <span className='text-gray-300'>{typeText[notification.type]}</span>
              <div className='text-gray-500 text-[13px]'>{timeAgo(notification.createdAt)}</div>
            </div>

            {notification.post &&
              <div className='w-12 h-12 rounded-md overflow-hidden shrink-0'>
                <img
                  src={notification.post.mediaType === "video" ? posterFor(notification.post.media) : notification.post.media}
                  className='w-full h-full object-cover'
                />
              </div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
