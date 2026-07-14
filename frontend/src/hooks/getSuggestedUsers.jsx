import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUsers } from '../redux/userSlice'

function getSuggestedUsers() {
  const dispatch = useDispatch();
  const userData = useSelector(state=>state.user);
  useEffect(()=>{
   const fetchSuggestedUsers = async()=>{
    try{
     const response = await axios.get(`${serverUrl}/api/user/suggested`,{withCredentials:true});
     dispatch(setSuggestedUsers(response.data));
    }catch(error){
      console.log(error);
    }
   }
   fetchSuggestedUsers();
  },[userData])
}

export default getSuggestedUsers