import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setNotifications } from '../redux/notificationSlice'

function getNotifications() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)

  useEffect(() => {
    if (!userData) return

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/notification`, { withCredentials: true })
        dispatch(setNotifications(response.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotifications()
  }, [userData?._id, dispatch])
}

export default getNotifications
