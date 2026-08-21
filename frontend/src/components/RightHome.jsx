import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiChevronRight } from "react-icons/fi"
import { serverUrl } from '../App'
import { setConversations, setSelectedUser } from '../redux/messageSlice'
import { toggleFollow } from '../redux/userSlice'
import Avatar from './Avatar'

function RightHome() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData, suggestedUsers, following } = useSelector(state => state.user)
  const { conversations, onlineUsers } = useSelector(state => state.message)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/message/conversations`, { withCredentials: true })
        dispatch(setConversations(response.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchConversations()
  }, [dispatch])

  const openChat = (otherUser) => {
    if (otherUser) dispatch(setSelectedUser(otherUser))
    navigate("/messages")
  }

  const handleFollow = async (id) => {
    dispatch(toggleFollow(id))
    try {
      await axios.get(`${serverUrl}/api/user/follow/${id}`, { withCredentials: true })
    } catch (error) {
      dispatch(toggleFollow(id))
      console.log(error)
    }
  }

  return (
    <aside className='hidden space-y-7 lg:block' aria-label='Chat, discover and suggestions'>

      <div className='rounded-2xl border border-border/70 bg-card p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='font-display text-sm font-semibold text-foreground'>Chats</h2>
          <button
            className='flex h-7 items-center gap-1 rounded-full px-2 text-[11px] text-muted-foreground transition hover:bg-accent hover:text-foreground'
            onClick={() => openChat(null)}
          >
            Open <FiChevronRight className='size-3' />
          </button>
        </div>

        <ul className='space-y-1'>
          {!conversations?.length &&
            <li className='px-2 py-4 text-center text-[11px] leading-5 text-muted-foreground'>
              No conversations yet.
            </li>}

          {conversations?.slice(0, 4).map(conversation => {
            const otherUser = conversation.participants?.find(p => p._id !== userData._id)
            if (!otherUser) return null
            const isOnline = onlineUsers.includes(otherUser._id)

            return (
              <li key={conversation._id}>
                <button
                  type='button'
                  onClick={() => openChat(otherUser)}
                  className='flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-muted'
                >
                  <span className='relative shrink-0'>
                    <Avatar user={otherUser} size='size-9' />
                    {isOnline &&
                      <span className='absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card' />}
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center justify-between gap-2'>
                      <span className='truncate text-xs font-semibold text-foreground'>{otherUser.userName}</span>
                    </span>
                    <span className='mt-0.5 block truncate text-[11px] text-muted-foreground'>
                      {conversation.lastMessage?.text || "Say hi 👋"}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <section className='border-b border-border/70 pb-6'>
        <div className='flex items-center gap-3'>
          <Avatar user={userData} size='size-12' text='text-xs' />
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-semibold text-foreground'>{userData?.name}</p>
            <p className='truncate text-xs text-muted-foreground'>@{userData?.userName}</p>
          </div>
          <button
            className='h-auto p-0 text-xs font-semibold text-primary hover:underline'
            onClick={() => navigate(`/profile/${userData?.userName}`)}
          >
            View
          </button>
        </div>

        <div className='mt-5 grid grid-cols-3 divide-x divide-border text-center'>
          {[
            { label: "Posts", value: userData?.posts?.length || 0 },
            { label: "Followers", value: userData?.followers?.length || 0 },
            { label: "Following", value: userData?.following?.length || 0 },
          ].map(stat =>
            <button key={stat.label} className='transition hover:opacity-80' onClick={() => navigate(`/profile/${userData?.userName}`)}>
              <p className='font-display text-base font-semibold text-foreground'>{stat.value}</p>
              <p className='mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground'>{stat.label}</p>
            </button>
          )}
        </div>
      </section>

      <section>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='font-display text-sm font-semibold text-foreground'>People to follow</h2>
        </div>
        <div className='space-y-4'>
          {suggestedUsers?.slice(0, 4).map(user =>
            <div key={user._id} className='flex items-center gap-3'>
              <Avatar user={user} size='size-9' text='text-[10px]' onClick={() => navigate(`/profile/${user.userName}`)} />
              <div className='min-w-0 flex-1 cursor-pointer' onClick={() => navigate(`/profile/${user.userName}`)}>
                <p className='truncate text-xs font-semibold text-foreground'>{user.name}</p>
                <p className='truncate text-[11px] text-muted-foreground'>@{user.userName}</p>
              </div>
              <button
                className={`h-7 shrink-0 rounded-full px-3 text-[11px] font-semibold transition ${following.includes(user._id)
                  ? "border border-border text-muted-foreground hover:text-foreground"
                  : "border border-border text-foreground hover:bg-accent"}`}
                onClick={() => handleFollow(user._id)}
              >
                {following.includes(user._id) ? "Following" : "Follow"}
              </button>
            </div>
          )}
          {!suggestedUsers?.length &&
            <p className='text-[11px] leading-5 text-muted-foreground'>No suggestions right now.</p>}
        </div>
      </section>

      <p className='px-1 text-[11px] leading-5 text-muted-foreground'>
        © {new Date().getFullYear()} Vybe · About · Privacy · Terms
      </p>
    </aside>
  )
}

export default RightHome
