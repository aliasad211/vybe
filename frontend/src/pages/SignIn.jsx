import React from 'react';
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useState } from 'react';
import { use } from 'react';
import { serverUrl } from '../App';

function SignIn() {
    const [inputClicked, setInputClicked] = useState({
        userName: false,
        password: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [err, setErr] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
       setLoading(true);
       setErr("");
        try {
            const response = await axios.post(
                `${serverUrl}/api/auth/signin`,
                { userName, password },
                { withCredentials: true }
            )
            console.log(response.data);
            setLoading(false)
        } catch (error) {
            setErr(error.response?.data?.message);
            console.log(error.response.data);
            setLoading(false);
        }
    }

    return (
        <div className='w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
            <div className='w-[90%] lg:max-w-[60%] h-150 bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>
                <div className='w-full lg:w-[50%] h-full bg-white flex flex-col justify-center items-center p-2.5 gap-5'>
                    <div className='flex gap-2.5 items-center text-[20px] font-semibold mt-10'>
                        <span>Sign In to</span>
                        <img src={logo} alt='' className='w-17.5' />
                    </div>

                    <div
                        className='relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl border-2 border-black'
                        onClick={(() => setInputClicked({ ...inputClicked, userName: true }))}
                    >
                        <label htmlFor="userName"
                            className={`text-gray-700 absolute left-5 p-1.25 bg-white text-3.75 ${inputClicked.userName ? "-top-4" : ""}`}>
                            Enter User Name
                        </label>
                        <input type='text' id='userName' className='w-full h-full rounded-2xl px-5 outline-none border-0' onChange={(e) => setUserName(e.target.value)} value={userName} required />

                    </div>


                    <div
                        className='relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl border-2 border-black'
                        onClick={(() => setInputClicked({ ...inputClicked, password: true }))}
                    >
                        <label htmlFor="password"
                            className={`text-gray-700 absolute left-5 p-1.25 bg-white text-3.75 ${inputClicked.password ? "-top-4" : ""}`}>
                            Enter Password
                        </label>
                        <input type={showPassword ? "text" : "password"} id='password' className='w-full h-full rounded-2xl px-5 outline-none border-0' onChange={(e) => setPassword(e.target.value)} value={password} required />
                        {!showPassword ?
                            <IoIosEye className='absolute cursor-pointer right-5 w-6 h-6' onClick={() => setShowPassword(true)} />
                            : <IoIosEyeOff className='absolute cursor-pointer right-5 w-6 h-6' onClick={() => setShowPassword(false)} />
                        }
                    </div>
                    <div className="w-[90%] px-5 cursor-pointer text-right">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    {err && <p className='text-red-500'>{err}</p>}

                    <button className='w-[70%] px-5 py-2.5 bg-black text-white font-semibold h-12.5 cursor-pointer rounded-2xl mt-1'
                        onClick={handleSignIn} disabled={loading}
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Sign In"}
                    </button>

                    <p className='cursor-pointer text-gray-800'>Want To Create A New Account ? <span className='border-b-2 border-b-black pb-0.5 text-black'><Link to="/signup">Sign Up</Link></span></p>

                </div>
                <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-2.5 text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>
                    <img src={logo2} alt="" className='w-[50%]' />
                    <p>Not Just A Platform, It's A VYBE</p>
                </div>
            </div>
        </div>
    )
}

export default SignIn