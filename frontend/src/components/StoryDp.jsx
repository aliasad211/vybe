import React from 'react'
import dp from "../assets/dp.jfif";
import { useSelector } from 'react-redux'
import { BiPlus } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { storyTone } from '../utils/tone';

function StoryDp({ profileImage, userName, story }) {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);

    const isOwn = userName === "Your Story";

    //viewers come back populated, but fall back to a raw id in case they don't
    const seen = !isOwn && story?.viewers?.some(
        viewer => (viewer?._id || viewer)?.toString() === userData?._id
    );

    const handleClick = () => {
        if (isOwn) {
            //no story yet — the ring doubles as the "add story" button
            navigate(story ? `/story/${userData?.userName}` : "/upload")
        } else {
            navigate(`/story/${userName}`)
        }
    }

    //the ring carries the state: dashed for your own empty slot, a tinted
    //gradient while unseen, and a flat border once watched
    const ring = isOwn && !story
        ? "story-self"
        : seen
            ? "story-seen"
            : storyTone(story?.author?._id || userData?._id)

    return (
        <button className='flex w-16 shrink-0 flex-col items-center gap-1.5' onClick={handleClick}>
            <div className={`relative grid size-16 place-items-center rounded-full p-[3px] ${ring}`}>
                <span className='block size-full overflow-hidden rounded-full border-[3px] border-background bg-surface'>
                    <img src={profileImage || dp} className='size-full object-cover' />
                </span>
                {isOwn && !story &&
                    <span className='absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground'>
                        <BiPlus className='size-3' />
                    </span>}
            </div>
            <span className={`w-full truncate text-center text-[11px] ${seen ? "font-medium text-muted-foreground" : "font-semibold text-foreground"}`}>
                {userName}
            </span>
        </button>
    )
}

export default StoryDp
