import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../redux/userSlice';

function Profile() {
    
    const {userName} = useParams();
    const dispatch = useDispatch();
    const {profileData} = useSelector(state=>state.user);
    const handleProfile=async()=>{
      try{
       const response = await axios.get(`${serverUrl}/api/user/getProgile/${userName}`,{withCredentials:true});
       dispatch(setProfileData(response.data));
    }catch(error){
        console.log(error);
      }
    }

    useEffect(()=>{
        handleProfile();
    },[userName,dispatch])
    
  return (
    <div>
      profileData?.name
    </div>
  )
}

export default Profile