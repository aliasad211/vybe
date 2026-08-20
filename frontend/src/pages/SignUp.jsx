import React from 'react';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useState } from 'react';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const field = 'h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'

function SignUp() {
   const [showPassword, setShowPassword] = useState(false);
   const [name, setName] = useState("");
   const [userName, setUserName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [err, setErr] = useState("");
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();

   const handleSignup = async () => {
      setLoading(true);
      setErr("");
      try {
         const response = await axios.post(
            `${serverUrl}/api/auth/signup`,
            { name, userName, email, password },
            { withCredentials: true }
         )
         dispatch(setUserData(response.data));
         setLoading(false)
      } catch (error) {
         setErr(error.response?.data?.message);
         setLoading(false);
      }
   }

   return (
      <div className='flex min-h-dvh w-full items-center justify-center bg-background px-4 py-10'>
         <div className='grid w-full max-w-[920px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_24px_60px_-40px_var(--shadow-color)] lg:grid-cols-2'>

            <div className='flex flex-col justify-center gap-5 p-8 sm:p-10'>
               <div className='flex items-center gap-2.5'>
                  <span className='brand-mark grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-primary-foreground'>V</span>
                  <span className='font-display text-[21px] font-semibold tracking-tight text-foreground'>Vybe</span>
               </div>

               <div>
                  <h1 className='font-display text-3xl font-semibold tracking-tight text-foreground'>Find your people</h1>
                  <p className='mt-1 text-sm text-muted-foreground'>Create an account and start sharing.</p>
               </div>

               <div className='flex flex-col gap-3.5'>
                  <input type='text' className={field} placeholder='Your name' onChange={(e) => setName(e.target.value)} value={name} required />
                  <input type='text' className={field} placeholder='Username' onChange={(e) => setUserName(e.target.value)} value={userName} required />
                  <input type='email' className={field} placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} required />

                  <div className='relative'>
                     <input
                        type={showPassword ? "text" : "password"}
                        className={`${field} pr-12`}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                        required
                     />
                     <button
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className='absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
                        onClick={() => setShowPassword(prev => !prev)}
                     >
                        {showPassword ? <IoIosEyeOff className='size-4' /> : <IoIosEye className='size-4' />}
                     </button>
                  </div>
               </div>

               {err && <p className='text-xs font-medium text-destructive'>{err}</p>}

               <button
                  className='grid h-12 w-full place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60'
                  onClick={handleSignup} disabled={loading}
               >
                  {loading ? <ClipLoader size={22} color='currentColor' /> : "Create account"}
               </button>

               <p className='text-center text-xs text-muted-foreground'>
                  Already have an account?{' '}
                  <Link to="/signin" className='font-semibold text-primary hover:underline'>Sign in</Link>
               </p>
            </div>

            <div className='brand-mark hidden flex-col justify-end gap-2 p-10 lg:flex'>
               <span className='font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70'>Vybe</span>
               <p className='font-display text-3xl font-semibold leading-tight tracking-tight text-primary-foreground'>
                  Not just a platform,<br />it&apos;s a Vybe.
               </p>
               <p className='mt-1 text-sm text-primary-foreground/80'>
                  Share posts, loops and stories with the people who matter.
               </p>
            </div>

         </div>
      </div>
   )
}

export default SignUp
