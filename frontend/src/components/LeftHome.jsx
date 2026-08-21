import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { RxVideo } from "react-icons/rx";
import { FiPlus, FiUser, FiLogOut, FiMessageSquare, FiUserPlus, FiChevronRight } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';

const groupLabel = 'px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground'

function LeftHome() {
    const { userData } = useSelector(state => state.user);
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

    const workspace = [
        { label: "Home", icon: GoHomeFill, to: "/", active: pathname === "/" },
        { label: "Loops", icon: RxVideo, to: "/loops", active: pathname === "/loops" },
        { label: "Notifications", icon: FaRegHeart, to: "/notifications", active: pathname === "/notifications", dot: unreadCount > 0 },
        { label: "Messages", icon: FiMessageSquare, to: "/messages", active: pathname === "/messages" },
    ];

    const yourSpace = [
        { label: "Create", icon: FiPlus, to: "/upload", active: pathname === "/upload" },
        { label: "Profile", icon: FiUser, to: `/profile/${userData?.userName}`, active: pathname.startsWith("/profile") },
    ];

    const item = ({ label, icon: Icon, to, active, dot }) =>
        <button
            key={label}
            className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition ${active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60"}`}
            onClick={() => navigate(to)}
        >
            <Icon className={`size-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
            <span className='truncate'>{label}</span>
            {dot && <span className='ml-auto size-1.5 rounded-full bg-notification' />}
        </button>

    return (
        <aside className='sticky top-0 hidden h-svh w-[264px] shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar hide-scrollbar lg:flex'>

            <div className='flex h-[72px] items-center px-4'>
                <div className='flex items-center gap-2.5'>
                    <span className='brand-mark grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-primary-foreground'>V</span>
                    <span className='font-display text-[21px] font-semibold tracking-tight text-foreground'>
                        vybe<span className='text-primary'>.</span>
                    </span>
                </div>
            </div>

            <div className='mx-4 h-px bg-sidebar-border' />

            <div className='flex flex-1 flex-col px-2 pt-5'>
                <div>
                    <p className={groupLabel}>Workspace</p>
                    <div className='mt-2 flex flex-col gap-1'>{workspace.map(item)}</div>
                </div>

                <div className='mt-7'>
                    <p className={groupLabel}>Your space</p>
                    <div className='mt-2 flex flex-col gap-1'>{yourSpace.map(item)}</div>
                </div>

                <div className='mt-auto px-2 pt-8'>
                    <div className='sidebar-invite rounded-2xl p-4'>
                        <div className='mb-4 grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground'>
                            <FiUserPlus className='size-4' />
                        </div>
                        <p className='font-display text-sm font-semibold text-foreground'>Build your circle</p>
                        <p className='mt-1 text-xs leading-5 text-muted-foreground'>
                            Invite a few good people to make Vybe yours.
                        </p>
                        <button
                            className='mt-4 flex h-8 w-full items-center justify-center gap-1 rounded-full border border-border bg-background text-xs font-semibold text-foreground transition hover:bg-accent'
                            onClick={() => navigate("/upload")}
                        >
                            Share something <FiChevronRight className='size-3' />
                        </button>
                    </div>
                </div>
            </div>

            <div className='p-3'>
                <button
                    className='flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-destructive'
                    onClick={handleLogOut}
                >
                    <FiLogOut className='size-4 shrink-0' />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    )
}

export default LeftHome
