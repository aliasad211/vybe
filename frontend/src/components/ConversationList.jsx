import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setConversations, setSelectedUser } from '../redux/messageSlice'
import dp from '../assets/dp.jfif'

function ConversationList() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
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

  return (
    <div className='flex h-full w-full flex-col'>

      <div className='flex h-[72px] shrink-0 items-center justify-between border-b border-border/70 px-5'>
        <h1 className='font-display text-xl font-semibold text-foreground'>Messages</h1>
        <span className='text-[11px] font-medium text-muted-foreground'>{conversations?.length || 0}</span>
      </div>

      <div className='flex-1 overflow-y-auto p-3 hide-scrollbar'>
        {!conversations?.length &&
          <p className='px-2 pt-3 text-xs leading-5 text-muted-foreground'>
            No conversations yet. Visit a profile and tap Message to start chatting.
          </p>}

        {conversations?.map((conversation) => {
          const otherUser = conversation.participants?.find(p => p._id !== userData._id)
          if (!otherUser) return null
          const isOnline = onlineUsers.includes(otherUser._id)

          return (
            <button
              key={conversation._id}
              className='flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-sidebar-accent'
              onClick={() => dispatch(setSelectedUser(otherUser))}
            >
              <div className='relative size-11 shrink-0'>
                <div className='size-11 overflow-hidden rounded-full ring-1 ring-border'>
                  <img src={otherUser.profileImage || dp} className='size-full object-cover' />
                </div>
                {isOnline &&
                  <span className='absolute bottom-0 right-0 size-3 rounded-full border-2 border-sidebar bg-emerald-500' />}
              </div>
              <div className='min-w-0 flex-1'>
                <div className='truncate text-sm font-semibold text-foreground'>{otherUser.userName}</div>
                <div className='mt-0.5 truncate text-[11px] text-muted-foreground'>
                  {conversation.lastMessage?.text || "Say hi 👋"}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ConversationList
