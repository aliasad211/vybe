import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoopCard from '../components/LoopCard';

function Loop() {
    const navigate = useNavigate();
    const { loopData } = useSelector(state => state.loop);

    return (
        <div className='w-full h-dvh bg-black relative'>

            <div className='w-full h-15 flex items-center gap-5 px-5 fixed top-2.5 left-0 z-30'>
                <IoIosArrowRoundBack className='text-white cursor-pointer w-7 h-7' onClick={() => navigate("/")} />
                <h1 className='text-white text-[20px] font-semibold'>Loops</h1>
            </div>

            <div className='w-full h-full overflow-y-scroll snap-y snap-mandatory flex flex-col items-center'>
                {loopData?.length > 0
                    ? loopData.map(loop => <LoopCard key={loop._id} loopData={loop} />)
                    : <div className='w-full h-full flex items-center justify-center text-white text-[16px]'>
                        No loops yet
                    </div>}
            </div>

        </div>
    )
}

export default Loop
