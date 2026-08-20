import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import dp from "../assets/dp.jfif";
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';

const field = 'h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'

function EditProfile() {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const imageInput = useRef();
    const [loading, setLoading] = useState(false);
    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
    const [backendImage, setBackendImage] = useState(null);
    const [name, setName] = useState(userData.name || "");
    const [userName, setUserName] = useState(userData.userName || "");
    const [bio, setBio] = useState(userData.bio || "");
    const [profession, setProfession] = useState(userData.profession || "");
    const [gender, setGender] = useState(userData.gender || "");

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleEditProfile = async () => {
        setLoading(true);
        try {
            const formdata = new FormData()
            formdata.append("name", name)
            formdata.append("userName", userName)
            formdata.append("bio", bio)
            formdata.append("profession", profession)
            formdata.append("gender", gender)
            if (backendImage) {
                formdata.append("profileImage", backendImage);
            }

            const response = await axios.post(`${serverUrl}/api/user/editProfile`, formdata, { withCredentials: true })
            dispatch(setProfileData(response.data.user));
            dispatch(setUserData(response.data.user));
            setLoading(false);
            navigate(`/profile/${response.data.user.userName}`);

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div className='min-h-screen w-full bg-background'>

            <header className='sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6'>
                <button aria-label='Back'
                    className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
                    onClick={() => navigate(`/profile/${userData.userName}`)}>
                    <IoIosArrowRoundBack className='size-6' />
                </button>
                <h1 className='font-display text-xl font-semibold text-foreground'>Edit profile</h1>
            </header>

            <div className='mx-auto w-full max-w-[520px] px-4 py-8 sm:px-6'>

                <div className='flex flex-col items-center gap-3'>
                    <button className='size-24 overflow-hidden rounded-full ring-2 ring-border transition hover:ring-primary'
                        onClick={() => imageInput.current.click()}>
                        <input type='file' accept='image/*' ref={imageInput} hidden onChange={handleImage} />
                        <img src={frontendImage} className='size-full object-cover' />
                    </button>
                    <button className='text-xs font-semibold text-primary' onClick={() => imageInput.current.click()}>
                        Change profile picture
                    </button>
                </div>

                <div className='mt-8 flex flex-col gap-3.5'>
                    <input type='text' className={field} placeholder='Your name' onChange={(e) => setName(e.target.value)} value={name} />
                    <input type='text' className={field} placeholder='Username' onChange={(e) => setUserName(e.target.value)} value={userName} />
                    <input type='text' className={field} placeholder='Bio' onChange={(e) => setBio(e.target.value)} value={bio} />
                    <input type='text' className={field} placeholder='Profession' onChange={(e) => setProfession(e.target.value)} value={profession} />
                    <input type='text' className={field} placeholder='Gender' onChange={(e) => setGender(e.target.value)} value={gender} />
                </div>

                <button className='mt-7 grid h-12 w-full place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60'
                    onClick={handleEditProfile} disabled={loading}>
                    {loading ? <ClipLoader size={22} color='currentColor' /> : "Save profile"}
                </button>
            </div>
        </div>
    )
}

export default EditProfile
