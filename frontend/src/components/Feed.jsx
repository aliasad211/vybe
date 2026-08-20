import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import StoryDp from './StoryDp.jsx';
import Nav from './Nav.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Post from './Post.jsx';

export default function Feed() {
    const { postData } = useSelector(state => state.post);
    const { userData } = useSelector(state => state.user);
    const { storyData } = useSelector(state => state.story);
    const { unreadCount } = useSelector(state => state.notification);
    const navigate = useNavigate();

    return (
        <main className='relative flex min-h-screen w-full min-w-0 flex-1 flex-col bg-background lg:h-screen lg:overflow-y-auto hide-scrollbar'>

            <header className='sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6'>
                <div className='flex items-center gap-2.5 lg:hidden'>
                    <span className='brand-mark grid size-8 place-items-center rounded-xl font-display text-sm font-bold text-primary-foreground'>V</span>
                    <span className='font-display text-xl font-semibold tracking-tight text-foreground'>Vybe</span>
                </div>
                <h1 className='hidden font-display text-xl font-semibold text-foreground lg:block'>Home feed</h1>

                <button aria-label='Notifications'
                    className='relative grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
                    onClick={() => navigate("/notifications")}>
                    <FaRegHeart className='size-5' />
                    {unreadCount > 0 &&
                        <span className='absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-notification text-[10px] font-bold text-white'>
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>}
                </button>
            </header>

            <section className='border-b border-border/70 px-4 py-5 sm:px-6'>
                <div className='flex gap-5 overflow-x-auto pb-1 hide-scrollbar'>
                    <StoryDp userName={"Your Story"} profileImage={userData.profileImage} story={userData.story} />
                    {storyData?.map(story =>
                        <StoryDp
                            key={story._id}
                            userName={story.author?.userName}
                            profileImage={story.author?.profileImage}
                            story={story}
                        />
                    )}
                </div>
            </section>

            <div className='flex w-full flex-col items-center gap-5 px-4 py-6 pb-28 sm:px-6 lg:pb-10'>
                {postData?.map((post, index) =>
                    <Post postData={post} key={post._id || index} />
                )}
                {!postData?.length &&
                    <div className='w-full max-w-[560px] rounded-2xl border border-border/70 bg-card p-8 text-center'>
                        <p className='font-display text-base font-semibold text-foreground'>Your feed is quiet</p>
                        <p className='mt-1 text-xs leading-5 text-muted-foreground'>Follow a few people or share the first post.</p>
                    </div>}
            </div>

            <Nav />
        </main>
    )
}
