import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { RxVideo } from "react-icons/rx";
import { FiPlus, FiMessageSquare, FiUser } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { userData } = useSelector(state => state.user);

    const links = [
        { label: "Home", icon: GoHomeFill, to: "/", active: pathname === "/" },
        { label: "Loops", icon: RxVideo, to: "/loops", active: pathname === "/loops" },
        { label: "Messages", icon: FiMessageSquare, to: "/messages", active: pathname === "/messages" },
        { label: "Profile", icon: FiUser, to: `/profile/${userData?.userName}`, active: pathname.startsWith("/profile") },
    ];

    return (
        <nav
            aria-label='Mobile navigation'
            className='fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-3 py-2 backdrop-blur-xl lg:hidden'
            style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
            <div className='mx-auto flex max-w-md items-center justify-around'>
                {links.map(({ label, icon: Icon, to, active }) =>
                    <button
                        key={label}
                        aria-label={label}
                        className={`relative grid h-11 w-12 place-items-center rounded-2xl transition ${active ? "text-primary" : "text-muted-foreground"}`}
                        onClick={() => navigate(to)}
                    >
                        <Icon className={`size-5 ${active ? "fill-primary/10" : ""}`} />
                    </button>
                )}
                <button
                    aria-label='Create'
                    className='grid h-11 w-12 place-items-center rounded-2xl text-muted-foreground transition'
                    onClick={() => navigate("/upload")}
                >
                    <FiPlus className='size-5' />
                </button>
            </div>
        </nav>
    )
}

export default Nav
