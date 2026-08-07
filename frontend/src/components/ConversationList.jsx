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
    <div className='w-full flex flex-col'>
      <h1 className='text-white text-[20px] font-semibold p-5 pb-2.5'>Messages</h1>

      {conversations?.length === 0 &&
        <div className='text-gray-400 text-[14px] px-5'>
          No conversations yet. Visit a profile and tap Message to start chatting.
        </div>}

      {conversations?.map((conversation) => {
        const otherUser = conversation.participants?.find(p => p._id !== userData._id)
        if (!otherUser) return null
        const isOnline = onlineUsers.includes(otherUser._id)

        return (
          <div
            key={conversation._id}
            className='w-full flex items-center gap-2.5 px-5 py-2.5 cursor-pointer hover:bg-gray-900'
            onClick={() => dispatch(setSelectedUser(otherUser))}
          >
            <div className='relative w-11 h-11 shrink-0'>
              <div className='w-11 h-11 border-2 border-black rounded-full overflow-hidden'>
                <img src={otherUser.profileImage || dp} className='w-full h-full object-cover' />
              </div>
              {isOnline && <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full' />}
            </div>
            <div className='flex flex-col overflow-hidden'>
              <span className='text-white text-[15px] font-semibold truncate'>{otherUser.userName}</span>
              <span className='text-gray-400 text-[13px] truncate'>{conversation.lastMessage?.text || "Say hi 👋"}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConversationList
