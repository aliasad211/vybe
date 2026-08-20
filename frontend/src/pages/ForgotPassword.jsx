import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from "react-spinners";
import { serverUrl } from '../App';
import axios from 'axios';

const field = 'h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'

const STEPS = [
  { title: "Forgot password", copy: "Enter your email and we'll send you a one-time code." },
  { title: "Check your inbox", copy: "Enter the code we just emailed you." },
  { title: "Reset password", copy: "Pick a new password for your account." },
]

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStep1 = async () => {
    setLoading(true);
    setErr("");
    try {
      await axios.post(`${serverUrl}/api/auth/sendOtp`, { email }, { withCredentials: true });
      setStep(2);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErr(error.response?.data?.message);
    }
  }

  const handleStep2 = async () => {
    setLoading(true);
    setErr("");
    try {
      await axios.post(`${serverUrl}/api/auth/verifyOtp`, { email, otp }, { withCredentials: true });
      setStep(3);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErr(error.response?.data?.message);
    }
  }

  const handleStep3 = async () => {
    if (newPassword !== confirmNewPassword) {
      return setErr("Passwords do not match");
    }

    setErr("");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/resetPassword`, { email, password: newPassword }, { withCredentials: true });
      setLoading(false);
      setDone(true);
    } catch (error) {
      setLoading(false);
      setErr(error.response?.data?.message);
    }
  }

  const { title, copy } = STEPS[step - 1]

  return (
    <div className='flex min-h-dvh w-full items-center justify-center bg-background px-4 py-10'>
      <div className='w-full max-w-[420px] rounded-2xl border border-border/70 bg-card p-8 shadow-[0_24px_60px_-40px_var(--shadow-color)]'>

        <div className='mb-6 flex items-center gap-2.5'>
          <span className='brand-mark grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-primary-foreground'>V</span>
          <span className='font-display text-[21px] font-semibold tracking-tight text-foreground'>Vybe</span>
        </div>

        {/* three dots so it is obvious where you are in the flow */}
        <div className='mb-5 flex items-center gap-1.5'>
          {[1, 2, 3].map(n =>
            <span key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-primary" : "bg-border"}`} />
          )}
        </div>

        <h1 className='font-display text-xl font-semibold text-foreground'>{title}</h1>
        <p className='mt-1 text-xs leading-5 text-muted-foreground'>{copy}</p>

        <div className='mt-6 flex flex-col gap-3.5'>
          {step === 1 &&
            <input type='email' className={field} placeholder='Email address'
              onChange={(e) => setEmail(e.target.value)} value={email}
              onKeyDown={(e) => e.key === "Enter" && handleStep1()} required />}

          {step === 2 &&
            <input type='text' className={`${field} tracking-[0.3em]`} placeholder='One-time code'
              onChange={(e) => setOtp(e.target.value)} value={otp}
              onKeyDown={(e) => e.key === "Enter" && handleStep2()} required />}

          {step === 3 && <>
            <input type='password' className={field} placeholder='New password'
              onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />
            <input type='password' className={field} placeholder='Confirm new password'
              onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword}
              onKeyDown={(e) => e.key === "Enter" && handleStep3()} required />
          </>}
        </div>

        {err && <p className='mt-3 text-xs font-medium text-destructive'>{err}</p>}
        {done && <p className='mt-3 text-xs font-medium text-primary'>Password updated. You can sign in now.</p>}

        <button
          className='mt-6 grid h-12 w-full place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60'
          disabled={loading}
          onClick={step === 1 ? handleStep1 : step === 2 ? handleStep2 : handleStep3}
        >
          {loading
            ? <ClipLoader size={22} color='currentColor' />
            : step === 1 ? "Send code" : step === 2 ? "Verify code" : "Reset password"}
        </button>

        <p className='mt-4 text-center text-xs text-muted-foreground'>
          <Link to="/signin" className='font-semibold text-primary hover:underline'>Back to sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default ForgotPassword
