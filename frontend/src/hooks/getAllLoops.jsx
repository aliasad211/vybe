import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setLoopData } from '../redux/loopSlice.js'

function getAllLoops() {
  const dispatch = useDispatch();
  useEffect(()=>{
   const fetchLoop = async()=>{
    try{
     const response = await axios.get(`${serverUrl}/api/loop/getAll`,{withCredentials:true});
     dispatch(setLoopData(response.data));
     console.log(`this is loops ${response.data}`);
    }catch(error){
      console.log(error);
    }
   }
   fetchLoop();
  },[])
}

export default getAllLoops