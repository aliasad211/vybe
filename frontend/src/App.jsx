import React from 'react'
import { Navigate,Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser'

export const serverUrl = "http://localhost:8000";

function App() {
  getCurrentUser();
  const {userData} = useSelector(state => state.user);
  
  return (
    <Routes>
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
    </Routes>
  )
}

export default App