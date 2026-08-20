import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import dp from "../assets/dp.jfif";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { userData } = useSelector(state => state.user);

    const item = (active) =>
        `grid h-11 w-12 place-items-center rounded-2xl transition ${active
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"}`

    const onProfile = pathname.startsWith("/profile");

    return (
        <div className='fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-border/70 bg-background/90 px-2 py-2 backdrop-blur-xl lg:hidden'
            style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
            <button aria-label='Home' className={item(pathname === "/")} onClick={() => navigate("/")}>
                <GoHomeFill className='size-5' />
            </button>
            <button aria-label='Search' className={item(false)}>
                <FiSearch className='size-5' />
            </button>
            <button aria-label='Create' className={item(pathname === "/upload")} onClick={() => navigate("/upload")}>
                <FiPlusSquare className='size-5' />
            </button>
            <button aria-label='Loops' className={item(pathname === "/loops")} onClick={() => navigate("/loops")}>
                <RxVideo className='size-5' />
            </button>
            <button aria-label='Profile' className={`grid h-11 w-12 place-items-center rounded-2xl transition ${onProfile ? "bg-accent" : "hover:bg-accent/60"}`}
                onClick={() => navigate(`/profile/${userData.userName}`)}>
                <span className={`block size-8 overflow-hidden rounded-full ring-2 ${onProfile ? "ring-primary" : "ring-border"}`}>
                    <img src={userData.profileImage || dp} className='size-full object-cover' />
                </span>
            </button>
        </div>
    )
}

export default Nav
