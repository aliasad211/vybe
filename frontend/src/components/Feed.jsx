import React from 'react'
import StoryDp from './StoryDp.jsx';
import Post from './Post.jsx';
import RightHome from './RightHome.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiSliders, FiChevronRight, FiPlay } from "react-icons/fi";
import { posterFor } from './VideoPlayer.jsx';

const today = () =>
    new Date().toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "long" })

const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
}

export default function Feed() {
    const { postData } = useSelector(state => state.post);
    const { userData } = useSelector(state => state.user);
    const { storyData } = useSelector(state => state.story);
    const { loopData } = useSelector(state => state.loop);
    const navigate = useNavigate();

    return (
        <main className='mx-auto w-full max-w-[1440px] flex-1 px-4 pb-24 pt-7 sm:px-6 md:pb-10 lg:px-8 lg:pt-10'>

            <div className='mb-7 flex items-end justify-between gap-4'>
                <div className='min-w-0'>
                    <p className='eyebrow mb-2'>{today()}</p>
                    <h1 className='font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl'>
                        {greeting()}, {userData?.name?.split(" ")[0] || userData?.userName}
                    </h1>
                </div>
                <button
                    className='flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground'
                    onClick={() => navigate("/upload")}
                >
                    <FiSliders className='size-4' />
                    <span className='hidden sm:inline'>Share something</span>
                </button>
            </div>

            <div className='mb-8 border-b border-border/70 pb-7'>
                <div className='mb-4 flex items-center justify-between'>
                    <div>
                        <h2 className='font-display text-base font-semibold text-foreground'>Your circles</h2>
                        <p className='mt-1 text-xs text-muted-foreground'>Small updates from people you follow</p>
                    </div>
                </div>
                <div className='flex gap-5 overflow-x-auto pb-1 hide-scrollbar'>
                    <StoryDp userName='Your story' profileImage={userData?.profileImage} name={userData?.name} story={userData?.story} />
                    {storyData?.map(story =>
                        <StoryDp
                            key={story._id}
                            userName={story.author?.userName}
                            name={story.author?.name}
                            profileImage={story.author?.profileImage}
                            story={story}
                        />
                    )}
                </div>
            </div>

            {loopData?.length > 0 &&
                <div className='mb-8 border-b border-border/70 pb-7'>
                    <div className='mb-4 flex items-center justify-between'>
                        <div>
                            <h2 className='font-display text-base font-semibold text-foreground'>Loops</h2>
                            <p className='mt-1 text-xs text-muted-foreground'>Short videos only — tap to open the full-screen feed</p>
                        </div>
                        <button
                            className='flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground'
                            onClick={() => navigate("/loops")}
                        >
                            Watch all <FiChevronRight className='size-3.5' />
                        </button>
                    </div>
                    <div className='flex gap-4 overflow-x-auto pb-1 hide-scrollbar'>
                        {loopData.slice(0, 8).map(loop =>
                            <button
                                key={loop._id}
                                type='button'
                                aria-label={`Open loop by ${loop.author?.userName}`}
                                className='group relative aspect-[9/16] w-[116px] shrink-0 overflow-hidden rounded-xl bg-muted'
                                onClick={() => navigate("/loops")}
                            >
                                <img src={posterFor(loop.media)} className='size-full object-cover' loading='lazy' />
                                <span className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-art-ink/55 to-transparent' />
                                <span className='absolute inset-0 grid place-items-center'>
                                    <span className='grid size-9 place-items-center rounded-full bg-foreground/35 text-background backdrop-blur transition group-hover:scale-110'>
                                        <FiPlay className='size-4 fill-current' />
                                    </span>
                                </span>
                                <span className='absolute inset-x-2 bottom-2 truncate text-left text-[11px] font-semibold text-background'>
                                    {loop.caption || loop.author?.userName}
                                </span>
                            </button>
                        )}
                    </div>
                </div>}

            <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,680px)_280px] xl:justify-center'>
                <section aria-label='Home feed' className='min-w-0'>
                    <div className='mb-5 flex items-center justify-between'>
                        <h2 className='font-display text-base font-semibold text-foreground'>All posts</h2>
                        <button aria-label='Feed settings' className='grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'>
                            <FiSettings className='size-4' />
                        </button>
                    </div>

                    <div className='space-y-6'>
                        {postData?.map((post, index) =>
                            <Post postData={post} key={post._id || index} />
                        )}
                        {!postData?.length &&
                            <div className='rounded-lg border border-border/80 bg-card p-10 text-center'>
                                <p className='font-display text-base font-semibold text-foreground'>Your feed is quiet</p>
                                <p className='mt-1 text-xs leading-5 text-muted-foreground'>Follow a few people or share the first post.</p>
                            </div>}
                    </div>
                </section>

                <RightHome />
            </div>
        </main>
    )
}
