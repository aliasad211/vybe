import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'

export const serverUrl = "http://localhost:8000";

function App() {
  const {userData} = useSelector(state => state.user);
  return (
    <Routes>
      <Route path='/' element={userData?<Home/>:<SignIn/>}/>
      <Route path='/signup' element={!userData?<SignUp/>:<Home/>}/>
      <Route path='/signin' element={!userData?<SignIn/>:<Home/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Home/>}/>
    </Routes>
  )
}

export default App