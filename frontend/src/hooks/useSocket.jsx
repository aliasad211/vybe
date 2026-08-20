import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { serverUrl } from '../App'
import { setOnlineUsers, addMessage, setConversations } from '../redux/messageSlice'
import { addNotification, removeNotificationById } from '../redux/notificationSlice'

function useSocket() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const selectedUser = useSelector(state => state.message.selectedUser)
  const selectedUserRef = useRef(selectedUser)
  const socketRef = useRef(null)

  //the socket listener is registered once per session but needs the currently
  //open chat, so it reads through a ref. writing that ref during render is not
  //safe under the react compiler, so it happens in its own effect
  useEffect(() => {
    selectedUserRef.current = selectedUser
  }, [selectedUser])

  useEffect(() => {
    if (!userData) {
      socketRef.current?.disconnect()
      socketRef.current = null
      return
    }

    const socket = io(serverUrl, { withCredentials: true })
    socketRef.current = socket

    socket.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers))
    })

    socket.on('newNotification', (notification) => {
      dispatch(addNotification(notification))
    })

    socket.on('notificationRemoved', (notificationId) => {
      dispatch(removeNotificationById(notificationId))
    })

    socket.on('newMessage', async (message) => {
      const openUser = selectedUserRef.current
      if (openUser && (message.sender === openUser._id || message.receiver === openUser._id)) {
        dispatch(addMessage(message))
      }
      try {
        const response = await axios.get(`${serverUrl}/api/message/conversations`, { withCredentials: true })
        dispatch(setConversations(response.data))
      } catch (error) {
        console.log(error)
      }
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [userData?._id, dispatch])
}

export default useSocket
