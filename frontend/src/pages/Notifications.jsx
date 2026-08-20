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

const typeIcon = {
  like: <FaHeart className='size-2.5 text-notification' />,
  comment: <FaRegComment className='size-2.5 text-primary' />,
  follow: <FaUserPlus className='size-2.5 text-emerald-500' />
}

//a like or comment can land on either a post or a loop, so the wording follows
//whichever one the notification points at
const describe = ({ type, loop }) => {
  if (type === "follow") return "started following you"
  const target = loop ? "loop" : "post"
  return type === "like" ? `liked your ${target}` : `commented on your ${target}`
}

//loops are always video, so both thumbnails come from the cloudinary poster frame
const thumbnailFor = ({ post, loop }) => {
  if (loop) return posterFor(loop.media)
  if (!post) return null
  return post.mediaType === "video" ? posterFor(post.media) : post.media
}

function Notifications() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notifications } = useSelector(state => state.notification)
  const { userData } = useSelector(state => state.user)

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

  //there is no single post route yet, so a post notification opens your own
  //profile, which is where the post it refers to lives
  const openTarget = (notification) => {
    if (notification.type === "follow") return navigate(`/profile/${notification.sender?.userName}`)
    if (notification.loop) return navigate("/loops")
    return navigate(`/profile/${userData?.userName}`)
  }

  return (
    <div className='min-h-screen w-full bg-background'>

      <header className='sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6'>
        <button aria-label='Back'
          className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
          onClick={() => navigate("/")}>
          <IoIosArrowRoundBack className='size-6' />
        </button>
        <h1 className='font-display text-xl font-semibold text-foreground'>Notifications</h1>
      </header>

      <div className='mx-auto w-full max-w-[640px] px-4 py-5 sm:px-6'>
        {!notifications?.length &&
          <div className='rounded-2xl border border-border/70 bg-card p-8 text-center'>
            <p className='font-display text-base font-semibold text-foreground'>Nothing yet</p>
            <p className='mt-1 text-xs leading-5 text-muted-foreground'>Likes, comments and new followers will show up here.</p>
          </div>}

        <div className='flex flex-col gap-2'>
          {notifications?.map((notification) => {
            const thumbnail = thumbnailFor(notification)

            return (
              <button
                key={notification._id}
                className={`flex w-full items-center gap-3.5 rounded-2xl border px-3.5 py-3 text-left transition hover:bg-accent/50 ${notification.seen
                  ? "border-border/70 bg-card"
                  : "border-primary/30 bg-accent/60"}`}
                onClick={() => openTarget(notification)}
              >
                <div className='relative size-11 shrink-0'>
                  <div className='size-11 overflow-hidden rounded-full ring-1 ring-border'>
                    <img src={notification.sender?.profileImage || dp} className='size-full object-cover' />
                  </div>
                  <span className='absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-card bg-card'>
                    {typeIcon[notification.type]}
                  </span>
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='text-[13px] leading-5 text-muted-foreground'>
                    <span className='font-semibold text-foreground'>{notification.sender?.userName}</span>{' '}
                    {describe(notification)}
                  </p>
                  <span className='mt-0.5 block text-[11px] text-muted-foreground'>{timeAgo(notification.createdAt)}</span>
                </div>

                {thumbnail &&
                  <div className='size-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-border'>
                    <img src={thumbnail} className='size-full object-cover' />
                  </div>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Notifications
