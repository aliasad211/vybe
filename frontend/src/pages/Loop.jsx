import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import LoopCard from '../components/LoopCard';

function Loop() {
    const navigate = useNavigate();
    const { loopData } = useSelector(state => state.loop);
    //sound is a property of the session, not of one clip — muting stays muted
    //as you scroll, the way it does everywhere else
    const [muted, setMuted] = useState(true);

    return (
        <div className='min-h-svh bg-background'>

            <header className='sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6'>
                <div className='flex items-center gap-3'>
                    <button
                        aria-label='Back to home'
                        className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground'
                        onClick={() => navigate("/")}
                    >
                        <FiArrowLeft className='size-4' />
                    </button>
                    <div>
                        <p className='eyebrow'>Video only</p>
                        <h1 className='font-display text-lg font-semibold tracking-tight text-foreground'>Loops</h1>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        aria-label={muted ? "Unmute loops" : "Mute loops"}
                        className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground'
                        onClick={() => setMuted(prev => !prev)}
                    >
                        {muted ? <IoMdVolumeOff className='size-4' /> : <IoMdVolumeHigh className='size-4' />}
                    </button>
                    <button
                        className='flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:opacity-90'
                        onClick={() => navigate("/upload")}
                    >
                        <FiPlus className='size-4' />
                        <span className='hidden sm:inline'>New loop</span>
                    </button>
                </div>
            </header>

            <main className='mx-auto w-full max-w-[520px] px-3 pb-24 pt-5 sm:px-4 lg:max-w-[560px] lg:pb-10'>
                {loopData?.length > 0
                    ? <section
                        aria-label='Loops video feed'
                        className='h-[calc(100svh-190px)] snap-y snap-mandatory space-y-4 overflow-y-auto pb-2 hide-scrollbar'
                    >
                        {loopData.map(loop =>
                            <LoopCard key={loop._id} loopData={loop} muted={muted} onToggleMute={() => setMuted(prev => !prev)} />
                        )}
                    </section>
                    : <div className='grid h-[calc(100svh-190px)] place-items-center rounded-2xl border border-border/80 bg-card text-center'>
                        <div>
                            <p className='font-display text-base font-semibold text-foreground'>No loops yet</p>
                            <p className='mt-1 text-xs text-muted-foreground'>Share the first one from Create.</p>
                        </div>
                    </div>}
            </main>
        </div>
    )
}

export default Loop
