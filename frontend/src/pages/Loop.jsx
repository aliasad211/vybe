import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoopCard from '../components/LoopCard';

function Loop() {
    const navigate = useNavigate();
    const { loopData } = useSelector(state => state.loop);

    return (
        <div className='relative h-dvh w-full bg-foreground'>

            <div className='fixed left-0 top-2.5 z-30 flex h-14 w-full items-center gap-3 px-4'>
                <button aria-label='Back'
                    className='grid size-9 place-items-center rounded-full text-background/80 backdrop-blur transition hover:bg-background/10 hover:text-background'
                    onClick={() => navigate("/")}>
                    <IoIosArrowRoundBack className='size-6' />
                </button>
                <h1 className='font-display text-xl font-semibold text-background'>Loops</h1>
            </div>

            <div className='flex h-full w-full snap-y snap-mandatory flex-col items-center overflow-y-scroll hide-scrollbar'>
                {loopData?.length > 0
                    ? loopData.map(loop => <LoopCard key={loop._id} loopData={loop} />)
                    : <div className='flex h-full w-full flex-col items-center justify-center gap-1'>
                        <p className='font-display text-base font-semibold text-background'>No loops yet</p>
                        <p className='text-xs text-background/60'>Share the first one from Create.</p>
                    </div>}
            </div>

        </div>
    )
}

export default Loop
