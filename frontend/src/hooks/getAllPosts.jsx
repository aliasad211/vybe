import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setPostData } from '../redux/postSlice'

function getAllPost() {
  const dispatch = useDispatch();
  useEffect(()=>{
   const fetchPost = async()=>{
    try{
     const response = await axios.get(`${serverUrl}/api/post/getAll`,{withCredentials:true});
     dispatch(setPostData(response.data));
     console.log(response.data);
    }catch(error){
      console.log(error);
    }
   }
   fetchPost();
  },[])
}

export default getAllPost