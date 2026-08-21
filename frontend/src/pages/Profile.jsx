import axios from 'axios';
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData, setUserData, toggleFollow } from '../redux/userSlice';
import { setSelectedUser } from '../redux/messageSlice';
import { FiArrowLeft, FiGrid, FiVideo, FiBookmark, FiEdit2, FiUserPlus, FiLogOut, FiX } from "react-icons/fi";
import Nav from '../components/Nav';
import Post from '../components/Post';
import Avatar from '../components/Avatar';
import { posterFor } from '../components/VideoPlayer';
import { avatarTone } from '../utils/tone';

function StatTile({ label, value, onClick }) {
    const inner = <>
        <span className='font-display text-lg font-semibold text-foreground'>{Number(value || 0).toLocaleString()}</span>
        <span className='text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>{label}</span>
    </>
    const base = 'flex flex-col items-center rounded-xl border border-border/70 bg-surface px-3 py-3'
    return onClick
        ? <button type='button' onClick={onClick} className={`${base} transition hover:border-primary/40 hover:bg-accent`}>{inner}</button>
        : <div className={base}>{inner}</div>
}

function Tab({ active, onClick, icon: Icon, label }) {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition ${active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
            <Icon className='size-4' />
            {label}
        </button>
    )
}

function Profile() {
    const { userName } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profileData, userData, following } = useSelector(state => state.user);
    const { postData } = useSelector(state => state.post);
    const { loopData } = useSelector(state => state.loop);
    //the tab resets when you walk to a different profile. deriving it from the
    //username beats mirroring it into an effect, which fires an extra render
    const [tabChoice, setTabChoice] = useState({ userName, tab: "posts" });
    const activeTab = tabChoice.userName === userName ? tabChoice.tab : "posts";
    const setActiveTab = (tab) => setTabChoice({ userName, tab });
    //a tile opens the full post in a dialog — the grid keeps the layout, the
    //dialog keeps like, comment and save working
    const [openPost, setOpenPost] = useState(null);

    const isOwnProfile = profileData?._id === userData?._id;

    const userPosts = useMemo(
        () => postData?.filter(post => post.author?._id === profileData?._id) || [],
        [postData, profileData]
    );

    const userLoops = useMemo(
        () => loopData?.filter(loop => loop.author?._id === profileData?._id) || [],
        [loopData, profileData]
    );

    const savedPosts = useMemo(
        () => postData?.filter(post => userData?.saved?.includes(post._id)) || [],
        [postData, userData]
    );

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
    }, [userName, dispatch])

    const isFollowing = following.includes(profileData?._id);

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
        navigate("/messages");
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    }

    const tiles = activeTab === "loops" ? userLoops : activeTab === "saved" ? savedPosts : userPosts;

    return (
        <div className='min-h-svh bg-background pb-24 lg:pb-0'>

            <header className='sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8'>
                <div className='flex min-w-0 items-center gap-3'>
                    <button
                        aria-label='Back to home'
                        className='grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground'
                        onClick={() => navigate("/")}
                    >
                        <FiArrowLeft className='size-4' />
                    </button>
                    <div className='min-w-0'>
                        <p className='truncate font-display text-base font-semibold text-foreground'>{profileData?.name}</p>
                        <p className='truncate text-xs text-muted-foreground'>@{profileData?.userName}</p>
                    </div>
                </div>
                {isOwnProfile &&
                    <button
                        aria-label='Log out'
                        className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-destructive'
                        onClick={handleLogOut}
                    >
                        <FiLogOut className='size-4' />
                    </button>}
            </header>

            <main className='mx-auto w-full max-w-[1100px] px-4 pb-16 pt-7 sm:px-6 lg:px-8'>

                <section className='overflow-hidden rounded-2xl border border-border/70 bg-card'>
                    <div className='h-28 w-full bg-[linear-gradient(135deg,var(--art-sky),var(--art-rose))] sm:h-36' />

                    <div className='px-5 pb-6 sm:px-8'>
                        <div className='-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between'>
                            <div className='flex items-end gap-4'>
                                <Avatar
                                    user={profileData}
                                    size='size-24 sm:size-28'
                                    text='text-xl'
                                    ring='ring-4 ring-card'
                                />
                                <div className='pb-1'>
                                    <h1 className='font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
                                        {profileData?.name}
                                    </h1>
                                    <p className='text-sm text-muted-foreground'>@{profileData?.userName}</p>
                                </div>
                            </div>

                            <div className='flex flex-wrap gap-2 pb-1'>
                                {isOwnProfile
                                    ? <>
                                        <button
                                            className='flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:opacity-90'
                                            onClick={() => navigate("/editprofile")}
                                        >
                                            <FiEdit2 className='size-3.5' /> Edit profile
                                        </button>
                                        <button
                                            className='flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-semibold text-foreground transition hover:bg-accent'
                                            onClick={() => navigate("/")}
                                        >
                                            <FiUserPlus className='size-3.5' /> Discover people
                                        </button>
                                    </>
                                    : <>
                                        <button
                                            className={`h-9 rounded-full px-5 text-xs font-semibold transition ${isFollowing
                                                ? "border border-border text-foreground hover:bg-accent"
                                                : "bg-primary text-primary-foreground hover:opacity-90"}`}
                                            onClick={handleFollow}
                                        >
                                            {isFollowing ? "Following" : "Follow"}
                                        </button>
                                        <button
                                            className='h-9 rounded-full border border-border px-5 text-xs font-semibold text-foreground transition hover:bg-accent'
                                            onClick={handleMessage}
                                        >
                                            Message
                                        </button>
                                    </>}
                            </div>
                        </div>

                        {profileData?.bio &&
                            <p className='mt-5 max-w-xl text-sm leading-6 text-foreground'>{profileData.bio}</p>}

                        {profileData?.profession &&
                            <div className='mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
                                <span className='inline-flex items-center gap-1.5'>{profileData.profession}</span>
                            </div>}

                        <div className='mt-6 grid max-w-md grid-cols-3 gap-2'>
                            <StatTile label='Posts' value={userPosts.length} />
                            <StatTile label='Followers' value={profileData?.followers?.length} />
                            <StatTile label='Following' value={profileData?.following?.length} />
                        </div>
                    </div>
                </section>

                <div className='mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]'>

                    <section aria-label='Content' className='min-w-0'>
                        <div className='mb-4 flex items-center gap-1 border-b border-border/70'>
                            <Tab active={activeTab === "posts"} onClick={() => setActiveTab("posts")} icon={FiGrid} label='Posts' />
                            <Tab active={activeTab === "loops"} onClick={() => setActiveTab("loops")} icon={FiVideo} label='Loops' />
                            {isOwnProfile &&
                                <Tab active={activeTab === "saved"} onClick={() => setActiveTab("saved")} icon={FiBookmark} label='Saved' />}
                        </div>

                        {tiles.length > 0
                            ? <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'>
                                {tiles.map(item => {
                                    const isLoop = activeTab === "loops"
                                    const src = isLoop || item.mediaType === "video" ? posterFor(item.media) : item.media
                                    return (
                                        <button
                                            key={item._id}
                                            type='button'
                                            className={`relative aspect-square overflow-hidden rounded-xl ${avatarTone(item._id)}`}
                                            onClick={() => isLoop ? navigate("/loops") : setOpenPost(item)}
                                        >
                                            {src && <img src={src} alt='' className='size-full object-cover' loading='lazy' />}
                                            {(isLoop || item.mediaType === "video") &&
                                                <span className='absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-foreground/30 text-background'>
                                                    <FiVideo className='size-3' />
                                                </span>}
                                            {activeTab === "saved" &&
                                                <span className='absolute left-2 top-2 grid size-6 place-items-center rounded-full bg-foreground/30 text-background'>
                                                    <FiBookmark className='size-3' />
                                                </span>}
                                        </button>
                                    )
                                })}
                            </div>
                            : <div className='rounded-2xl border border-border/70 bg-card p-10 text-center'>
                                <div className='mx-auto grid size-14 place-items-center rounded-full bg-muted'>
                                    <FiGrid className='size-6 text-muted-foreground' />
                                </div>
                                <h3 className='mt-4 font-display text-base font-semibold text-foreground'>
                                    {activeTab === "saved" ? "No saved posts" : activeTab === "loops" ? "No loops yet" : "No posts yet"}
                                </h3>
                                <p className='mt-1 text-xs leading-5 text-muted-foreground'>
                                    {activeTab === "saved"
                                        ? "Posts you save will show up here."
                                        : isOwnProfile
                                            ? "Share your first one from Create."
                                            : `${profileData?.name || "This user"} hasn't shared anything yet.`}
                                </p>
                            </div>}
                    </section>

                    <aside className='space-y-4' aria-label='Circle'>
                        <div className='rounded-2xl border border-border/70 bg-card p-4'>
                            <h2 className='font-display text-sm font-semibold text-foreground'>Your circle</h2>
                            <p className='mt-1 text-xs leading-5 text-muted-foreground'>
                                {profileData?.followers?.length || 0} followers · {profileData?.following?.length || 0} following
                            </p>
                            <div className='mt-3 space-y-3'>
                                {profileData?.followers?.slice(0, 4).map(person =>
                                    <div key={person._id} className='flex items-center gap-3'>
                                        <Avatar user={person} size='size-9' text='text-[10px]' onClick={() => navigate(`/profile/${person.userName}`)} />
                                        <div className='min-w-0 flex-1 cursor-pointer' onClick={() => navigate(`/profile/${person.userName}`)}>
                                            <p className='truncate text-xs font-semibold text-foreground'>{person.name}</p>
                                            <p className='truncate text-[11px] text-muted-foreground'>@{person.userName}</p>
                                        </div>
                                    </div>
                                )}
                                {!profileData?.followers?.length &&
                                    <p className='text-[11px] leading-5 text-muted-foreground'>No followers yet.</p>}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {openPost &&
                <div
                    className='fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm'
                    role='dialog'
                    aria-modal='true'
                    aria-label='Post'
                >
                    <button type='button' aria-label='Close' className='absolute inset-0 cursor-default' onClick={() => setOpenPost(null)} />
                    <div className='relative z-10 max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-2xl hide-scrollbar'>
                        <button
                            aria-label='Close'
                            className='absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-card/90 text-muted-foreground backdrop-blur transition hover:text-foreground'
                            onClick={() => setOpenPost(null)}
                        >
                            <FiX className='size-4' />
                        </button>
                        <Post postData={postData.find(p => p._id === openPost._id) || openPost} />
                    </div>
                </div>}

            <Nav />
        </div>
    )
}

export default Profile
