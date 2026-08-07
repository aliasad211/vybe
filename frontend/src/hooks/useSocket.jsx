import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { serverUrl } from '../App'
import { setOnlineUsers, addMessage } from '../redux/messageSlice'

function useSocket() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const socketRef = useRef(null)

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

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [userData?._id, dispatch])
}

export default useSocket
