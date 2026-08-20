import axios from 'axios';
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData, setUserData, toggleFollow } from '../redux/userSlice';
import { setSelectedUser } from '../redux/messageSlice';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiGrid, FiLogOut } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa6";
import dp from "../assets/dp.jfif";
import Nav from '../components/Nav';
import Post from '../components/Post';

function Profile() {

    const { userName } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profileData, userData, following } = useSelector(state => state.user);
    const { postData } = useSelector(state => state.post);
    const [activeTab, setActiveTab] = useState("posts");

    const isOwnProfile = profileData?._id === userData?._id;

    const userPosts = useMemo(() => {
        return postData?.filter(
            post => post.author?._id === profileData?._id
        );
    }, [postData, profileData]);

    const savedPosts = useMemo(() => {
        return postData?.filter(
            post => userData?.saved?.includes(post._id)
        );
    }, [postData, userData]);

    const visiblePosts = activeTab === "saved" ? savedPosts : userPosts;

    const handleProfile = useCallback(async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/profile/${userName}`, { withCredentials: true });
            dispatch(setProfileData(response.data));
        } catch (error) {
            console.log(error);
        }
    }, [userName, dispatch])

    useEffect(() => {
        handleProfile();
        setActiveTab("posts");
    }, [userName, dispatch])

    const isFollowing = following.includes(profileData?._id);

    //keeps the overlapping stack spacing for the first 3 avatars
    const stackPosition = ["", "-ml-3", "-ml-3"];

    const handleFollow = async () => {
        const targetId = profileData?._id;
        dispatch(toggleFollow(targetId));
        try {
            const response = await axios.get(`${serverUrl}/api/user/follow/${targetId}`, { withCredentials: true });
            dispatch(setProfileData(response.data.targetUser));
        } catch (error) {
            dispatch(toggleFollow(targetId));
            console.log(error);
        }
    }

    const handleMessage = () => {
        dispatch(setSelectedUser(profileData));
        navigate("/");
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    }

    const avatarStack = (users) => (
        <div className='flex items-center'>
            {users?.slice(0, 3).map((user, index) =>
                <div
                    key={user._id || index}
                    className={`size-7 cursor-pointer overflow-hidden rounded-full border-2 border-card ${stackPosition[index]}`}
                    onClick={() => navigate(`/profile/${user.userName}`)}
                >
                    <img src={user.profileImage || dp} className='size-full object-cover' />
                </div>
            )}
        </div>
    )

    return (
        <div className='min-h-screen w-full bg-background pb-28 lg:pb-10'>

            <header className='sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6'>
                <button aria-label='Back'
                    className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
                    onClick={() => navigate("/")}>
                    <IoIosArrowRoundBack className='size-6' />
                </button>
                <h1 className='truncate font-display text-xl font-semibold text-foreground'>{profileData?.userName}</h1>
                {isOwnProfile
                    ? <button aria-label='Log out'
                        className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-destructive'
                        onClick={handleLogOut}>
                        <FiLogOut className='size-4' />
                    </button>
                    : <span className='size-9' />}
            </header>

            <div className='mx-auto w-full max-w-[640px] px-4 py-6 sm:px-6'>

                <section className='rounded-2xl border border-border/70 bg-card p-5 shadow-[0_10px_35px_-28px_var(--shadow-color)]'>
                    <div className='flex items-center gap-4'>
                        <div className='size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-border'>
                            <img src={profileData?.profileImage || dp} className='size-full object-cover' />
                        </div>
                        <div className='min-w-0'>
                            <h2 className='truncate font-display text-xl font-semibold text-foreground'>{profileData?.name}</h2>
                            <p className='mt-0.5 truncate text-xs text-muted-foreground'>{profileData?.profession || "New User"}</p>
                            {profileData?.bio &&
                                <p className='mt-1 text-xs leading-5 text-muted-foreground'>{profileData.bio}</p>}
                        </div>
                    </div>

                    <div className='mt-5 grid grid-cols-3 divide-x divide-border text-center'>
                        <div className='px-2'>
                            <div className='font-display text-xl font-semibold text-foreground'>{profileData?.posts?.length || 0}</div>
                            <div className='mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground'>Posts</div>
                        </div>
                        <div className='px-2'>
                            <div className='flex items-center justify-center gap-2'>
                                {avatarStack(profileData?.followers)}
                                <span className='font-display text-xl font-semibold text-foreground'>{profileData?.followers?.length || 0}</span>
                            </div>
                            <div className='mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground'>Followers</div>
                        </div>
                        <div className='px-2'>
                            <div className='flex items-center justify-center gap-2'>
                                {avatarStack(profileData?.following)}
                                <span className='font-display text-xl font-semibold text-foreground'>{profileData?.following?.length || 0}</span>
                            </div>
                            <div className='mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground'>Following</div>
                        </div>
                    </div>

                    <div className='mt-5 flex items-center gap-2.5'>
                        {isOwnProfile
                            ? <button className='h-10 flex-1 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90'
                                onClick={() => navigate("/editprofile")}>
                                Edit Profile
                            </button>
                            : <>
                                <button
                                    className={`h-10 flex-1 rounded-full px-5 text-sm font-semibold transition ${isFollowing
                                        ? "border border-border text-foreground hover:bg-accent"
                                        : "bg-primary text-primary-foreground hover:opacity-90"}`}
                                    onClick={handleFollow}>
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                                <button className='h-10 flex-1 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-accent'
                                    onClick={handleMessage}>
                                    Message
                                </button>
                            </>}
                    </div>
                </section>

                {isOwnProfile &&
                    <div className='mt-6 flex items-center gap-2'>
                        <button
                            className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition ${activeTab === "posts"
                                ? "bg-primary text-primary-foreground"
                                : "border border-border text-muted-foreground hover:text-foreground"}`}
                            onClick={() => setActiveTab("posts")}
                        >
                            <FiGrid className='size-3.5' />
                            Posts
                        </button>
                        <button
                            className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition ${activeTab === "saved"
                                ? "bg-primary text-primary-foreground"
                                : "border border-border text-muted-foreground hover:text-foreground"}`}
                            onClick={() => setActiveTab("saved")}
                        >
                            <FaRegBookmark className='size-3' />
                            Saved
                        </button>
                    </div>}

                <div className='mt-6 flex flex-col items-center gap-5'>
                    {visiblePosts?.length > 0
                        ? visiblePosts.map((post) => <Post key={post._id} postData={post} />)
                        : <div className='w-full rounded-2xl border border-border/70 bg-card p-10 text-center'>
                            <div className='mx-auto grid size-14 place-items-center rounded-full bg-muted'>
                                <FiGrid className='size-6 text-muted-foreground' />
                            </div>
                            <h3 className='mt-4 font-display text-base font-semibold text-foreground'>
                                {activeTab === "saved" ? "No saved posts" : "No posts yet"}
                            </h3>
                            <p className='mt-1 text-xs leading-5 text-muted-foreground'>
                                {activeTab === "saved"
                                    ? "You haven't saved any posts yet."
                                    : isOwnProfile
                                        ? "Share your first post."
                                        : `${profileData?.name || "This user"} hasn't shared any posts yet.`}
                            </p>
                        </div>}
                </div>
            </div>

            <Nav />
        </div>
    )
}

export default Profile
