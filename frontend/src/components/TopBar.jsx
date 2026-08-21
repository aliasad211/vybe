import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiSearch, FiPlus, FiChevronRight } from "react-icons/fi"
import { FaRegHeart } from "react-icons/fa"
import Avatar from './Avatar'

function TopBar({ crumb = "Home", trail = "All posts" }) {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const { unreadCount } = useSelector(state => state.notification)

  return (
    <header className='sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8'>

      <div className='flex min-w-0 items-center gap-3'>
        <div className='flex items-center gap-2.5 lg:hidden'>
          <span className='brand-mark grid size-8 place-items-center rounded-xl font-display text-sm font-bold text-primary-foreground'>V</span>
          <span className='font-display text-xl font-semibold tracking-tight text-foreground'>vybe<span className='text-primary'>.</span></span>
        </div>
        <div className='hidden min-w-0 items-center gap-2 text-sm text-muted-foreground lg:flex'>
          <span className='font-medium text-foreground'>{crumb}</span>
          <FiChevronRight className='size-3.5' />
          <span className='truncate'>{trail}</span>
        </div>
      </div>

      <div className='flex items-center gap-2 sm:gap-3'>
        <label className='relative hidden sm:block'>
          <FiSearch className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <input
            aria-label='Search Vybe'
            placeholder='Search Vybe'
            className='h-10 w-48 rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 lg:w-64'
          />
        </label>

        <button aria-label='Search' className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground sm:hidden'>
          <FiSearch className='size-4' />
        </button>

        <button
          aria-label='Notifications'
          className='relative grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
          onClick={() => navigate("/notifications")}
        >
          <FaRegHeart className='size-4' />
          {unreadCount > 0 &&
            <span className='absolute right-2 top-2 size-1.5 rounded-full bg-notification' />}
        </button>

        <button
          className='hidden h-9 items-center gap-1.5 rounded-full bg-secondary px-4 text-xs font-semibold text-secondary-foreground transition hover:bg-accent sm:inline-flex'
          onClick={() => navigate("/upload")}
        >
          <FiPlus className='size-4' />
          Share
        </button>

        <Avatar
          user={userData}
          size='size-9'
          text='text-xs'
          ring='ring-2 ring-background'
          onClick={() => navigate(`/profile/${userData?.userName}`)}
        />
      </div>
    </header>
  )
}

export default TopBar
