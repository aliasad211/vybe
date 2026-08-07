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
    <div className='w-full h-screen flex flex-col'>
      <div className='w-full flex items-center gap-2.5 p-5 border-b-2 border-gray-700'>
        <IoIosArrowRoundBack className='text-white w-7 h-7 cursor-pointer' onClick={() => dispatch(setSelectedUser(null))} />
        <div className='w-10 h-10 border-2 border-black rounded-full overflow-hidden'>
          <img src={selectedUser.profileImage || dp} className='w-full h-full object-cover' />
        </div>
        <div>
          <div className='text-white text-[16px] font-semibold'>{selectedUser.userName}</div>
          <div className='text-[12px] text-gray-400'>{isOnline ? "Online" : "Offline"}</div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto flex flex-col gap-2.5 p-5'>
        {messages?.map((message, index) => {
          const isOwn = message.sender === userData._id
          return (
            <div
              key={message._id || index}
              className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-[14px] break-words ${isOwn ? "self-end bg-blue-600 text-white" : "self-start bg-gray-800 text-white"}`}
            >
              {message.text}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className='w-full flex items-center gap-2.5 p-5 border-t-2 border-gray-700'>
        <input
          type='text'
          placeholder='Message...'
          className='flex-1 h-10 px-3.5 rounded-full bg-gray-800 text-white outline-none'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className='cursor-pointer disabled:opacity-40' onClick={handleSend} disabled={!text.trim()}>
          <IoSend className='text-white w-6 h-6' />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
