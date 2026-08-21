import React from 'react'
import { useSelector } from 'react-redux'
import { FiPlus } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { storyTone, initials } from '../utils/tone';

function StoryDp({ profileImage, userName, name, story }) {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);

    const isOwn = userName === "Your story";

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
    const tone = isOwn && !story
        ? "story-self"
        : seen
            ? "story-seen"
            : storyTone(story?.author?._id || userData?._id)

    return (
        <button
            type='button'
            className='group flex w-[58px] shrink-0 flex-col items-center gap-2'
            onClick={handleClick}
        >
            <div className={`story-ring ${tone} grid size-[58px] place-items-center rounded-full p-[3px] transition-transform group-hover:scale-105`}>
                <div className='grid size-full place-items-center overflow-hidden rounded-full border-[3px] border-background bg-surface text-[11px] font-bold text-foreground'>
                    {isOwn && !story
                        ? <FiPlus className='size-4 text-primary' />
                        : profileImage
                            ? <img src={profileImage} className='size-full object-cover' />
                            : initials(name || userName)}
                </div>
            </div>
            <span className='w-full truncate text-center text-[11px] font-medium text-muted-foreground'>
                {isOwn ? "Your story" : userName}
            </span>
        </button>
    )
}

export default StoryDp
