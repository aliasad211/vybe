import React from 'react'
import dp from "../assets/dp.jfif";
import { GoHomeFill } from "react-icons/go";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare, FiLogOut } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import OtherUser from './OtherUser';

function LeftHome() {
    const { userData, suggestedUsers } = useSelector(state => state.user);
    const { unreadCount } = useSelector(state => state.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    }

    const links = [
        { label: "Home", icon: GoHomeFill, to: "/", active: pathname === "/" },
        { label: "Create", icon: FiPlusSquare, to: "/upload", active: pathname === "/upload" },
        { label: "Loops", icon: RxVideo, to: "/loops", active: pathname === "/loops" },
        { label: "Notifications", icon: FaRegHeart, to: "/notifications", active: pathname === "/notifications", badge: unreadCount },
        { label: "Profile", icon: BiUser, to: `/profile/${userData.userName}`, active: pathname.startsWith("/profile") },
    ];

    return (
        <aside className='hidden h-screen w-[26%] shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-5 hide-scrollbar lg:flex'>

            <div className='mb-7 flex items-center gap-2.5 px-2'>
                <span className='brand-mark grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-primary-foreground'>V</span>
                <span className='font-display text-[21px] font-semibold tracking-tight text-sidebar-foreground'>Vybe</span>
            </div>

            <nav className='flex flex-col gap-1'>
                {links.map(({ label, icon: Icon, to, active, badge }) =>
                    <button
                        key={label}
                        className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}
                        onClick={() => navigate(to)}
                    >
                        <Icon className='size-5 shrink-0' />
                        <span className='truncate'>{label}</span>
                        {badge > 0 &&
                            <span className='ml-auto grid size-5 shrink-0 place-items-center rounded-full bg-notification text-[10px] font-bold text-white'>
                                {badge > 9 ? "9+" : badge}
                            </span>}
                    </button>
                )}
            </nav>

            <div className='mt-7 rounded-2xl border border-border/70 bg-card p-3.5'>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex min-w-0 items-center gap-3'>
                        <div className='size-11 shrink-0 cursor-pointer overflow-hidden rounded-full ring-1 ring-border'
                            onClick={() => navigate(`/profile/${userData.userName}`)}>
                            <img src={userData.profileImage || dp} className='size-full object-cover' />
                        </div>
                        <div className='min-w-0'>
                            <div className='truncate text-sm font-semibold text-foreground'>{userData.userName}</div>
                            <div className='mt-0.5 truncate text-[11px] text-muted-foreground'>{userData.name}</div>
                        </div>
                    </div>
                    <button aria-label='Log out'
                        className='grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-destructive'
                        onClick={handleLogOut}>
                        <FiLogOut className='size-4' />
                    </button>
                </div>
            </div>

            <div className='mt-7'>
                <div className='mb-4 flex items-center justify-between px-1'>
                    <h2 className='font-display text-sm font-semibold text-foreground'>Suggested for you</h2>
                </div>
                <div className='flex flex-col gap-4 px-1'>
                    {suggestedUsers?.slice(0, 5).map((user, index) =>
                        <OtherUser key={user._id || index} user={user} />
                    )}
                    {!suggestedUsers?.length &&
                        <p className='px-1 text-[11px] leading-5 text-muted-foreground'>No suggestions right now.</p>}
                </div>
            </div>

            <div className='sidebar-invite mt-auto rounded-2xl p-4'>
                <p className='font-display text-sm font-semibold text-foreground'>Build your circle</p>
                <p className='mt-1 text-xs leading-5 text-muted-foreground'>
                    Share a story or a loop today and let your people find you.
                </p>
                <button className='mt-3 h-8 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:opacity-90'
                    onClick={() => navigate("/upload")}>
                    Create a post
                </button>
            </div>

        </aside>
    )
}

export default LeftHome
