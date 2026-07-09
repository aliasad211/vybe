import React from 'react';
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useState } from 'react';
import { use } from 'react';

function SignUp() {
   const [inputClicked, setInputClicked] = useState({
    name:false,
    userName: false,
    email:false,
    password:false
   });
   const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
        <div className='w-[90%] lg:max-w-[60%] h-150 bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>
           <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-2.5 gap-5'>
               <div className='flex gap-2.5 items-center text-[20px] font-semibold mt-10'>
                  <span>Sign Up to</span>
                  <img src={logo} alt='' className='w-17.5'/>
               </div>

               <div 
               className='relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-7.5 border-2 border-black'
               onClick={(()=>setInputClicked({...inputClicked, name:true}))}
               >
                   <label htmlFor="name" 
                   className={`text-gray-700 absolute left-5 p-1.25 bg-white text-3.75 ${inputClicked.name ? "-top-4": ""}`}>
                    Enter Your Name
                    </label>
                    <input type='text' id='name' className='w-full h-full rounded-2xl px-5 outline-none border-0' required/>
                   
               </div>

               <div 
               className='relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl border-2 border-black'
               onClick={(()=>setInputClicked({...inputClicked, userName:true}))}
               >
                   <label htmlFor="userName" 
                   className={`text-gray-700 absolute left-5 p-1.25 bg-white text-3.75 ${inputClicked.userName ? "-top-4": ""}`}>
                    Enter User Name
                    </label>
                    <input type='text' id='userName' className='w-full h-full rounded-2xl px-5 outline-none border-0' required/>
                   
               </div>

               <div 
               className='relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl border-2 border-black'
               onClick={(()=>setInputClicked({...inputClicked, email:true}))}
               >
                   <label htmlFor="email" 
                   className={`text-gray-700 absolute left-5 p-1.25 bg-white text-3.75 ${inputClicked.email ? "-top-4": ""}`}>
                    Enter Your Email
                    </label>
                    <input type='text' id='email' className='w-full h-full rounded-2xl px-5 outline-none border-0' required/>
                   
               </div>

               <div 
               className='relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl border-2 border-black'
               onClick={(()=>setInputClicked({...inputClicked, password:true}))}
               >
                   <label htmlFor="password" 
                   className={`text-gray-700 absolute left-5 p-1.25 bg-white text-3.75 ${inputClicked.password ? "-top-4": ""}`}>
                    Enter Password
                    </label>
                    <input type={showPassword ? "text" : "password"} id='password' className='w-full h-full rounded-2xl px-5 outline-none border-0' required/>
                   {!showPassword ? 
                   <IoIosEye className='absolute cursor-pointer right-5 w-6 h-6' onClick={()=>setShowPassword(true)} />
                   : <IoIosEyeOff className='absolute cursor-pointer right-5 w-6 h-6' onClick={()=>setShowPassword(false)}/>
                    }
                </div>

                <button className='w-[70%] px-5 py-2.5 bg-black text-white font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5'>Sign Up</button>

                <p className='cursor-pointer text-gray-800'>Already Have an account ? <span className='border-b-2 border-b-black pb-0.5 text-black'>Sign In</span></p>

           </div>
           <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-2.5 text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>
               <img src={logo2} alt="" className='w-[50%]' />
               <p>Not Just A Platform, It's A VYBE</p>
           </div>
        </div>
    </div>
  )
}

export default SignUp