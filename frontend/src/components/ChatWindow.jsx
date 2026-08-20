import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io"
import { IoSend } from "react-icons/io5"
import { serverUrl } from '../App'
import { setMessages, addMessage, setSelectedUser } from '../redux/messageSlice'
import dp from '../assets/dp.jfif'

function ChatWindow() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const { selectedUser, messages, onlineUsers } = useSelector(state => state.message)
  const [text, setText] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/message/${selectedUser._id}`, { withCredentials: true })
        dispatch(setMessages(response.data))
      } catch (error) {
        console.log(error)
      }
    }
    if (selectedUser?._id) fetchMessages()
  }, [selectedUser?._id, dispatch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim()) return
    try {
      const response = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, { text }, { withCredentials: true })
      dispatch(addMessage(response.data))
      setText("")
    } catch (error) {
      console.log(error)
    }
  }

  const isOnline = onlineUsers.includes(selectedUser._id)

  return (
    <div className='flex h-full w-full flex-col'>

      <div className='flex h-[72px] shrink-0 items-center gap-3 border-b border-border/70 px-4'>
        <button aria-label='Back'
          className='grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
          onClick={() => dispatch(setSelectedUser(null))}>
          <IoIosArrowRoundBack className='size-6' />
        </button>
        <div className='size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border'>
          <img src={selectedUser.profileImage || dp} className='size-full object-cover' />
        </div>
        <div className='min-w-0'>
          <div className='truncate text-sm font-semibold text-foreground'>{selectedUser.userName}</div>
          <div className='mt-0.5 text-[11px] text-muted-foreground'>{isOnline ? "Online" : "Offline"}</div>
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-2 overflow-y-auto p-4 hide-scrollbar'>
        {messages?.map((message, index) => {
          const isOwn = message.sender === userData._id
          return (
            <div
              key={message._id || index}
              className={`max-w-[78%] break-words rounded-2xl px-3.5 py-2 text-[13px] leading-5 ${isOwn
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted text-foreground"}`}
            >
              {message.text}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className='flex shrink-0 items-center gap-2.5 border-t border-border/70 p-4'>
        <input
          type='text'
          placeholder='Message...'
          className='h-10 min-w-0 flex-1 rounded-full bg-muted px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className='grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40'
          onClick={handleSend} disabled={!text.trim()}>
          <IoSend className='size-4' />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
