import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryData } from '../redux/storySlice.js'

function getAllStories() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user);

  useEffect(()=>{
   if(!userData) return
   const fetchStories = async()=>{
    try{
     const response = await axios.get(`${serverUrl}/api/story/getAll`,{withCredentials:true});
     dispatch(setStoryData(response.data));
    }catch(error){
      console.log(error);
    }
   }
   fetchStories();
  },[userData?._id])
}

export default getAllStories
