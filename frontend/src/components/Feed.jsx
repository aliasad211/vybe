import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import logo2 from "../assets/logo2.png";
import StoryDp from './StoryDp.jsx';
import Nav from './Nav.jsx';

export default function Feed() {
    return (
        <div className='lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto hide-scrollbar'>
            <div className='lg:hidden md:block w-full h-25 flex items-center justify-between p-5'>
                <img src={logo2} alt='' className='w-20' />
                <div>
                    <FaRegHeart className='text-white w-6 h-6' />
                </div>
            </div>

            <div className='flex w-full overflow-auto hide-scrollbar gap-4 p-5'>
              <StoryDp userName={"asadjfkdjfkdjfkfjdkfj"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>
              <StoryDp userName={"asad"}/>

            </div>

            <div className='w-full min-h-screen flex flex-col items-center gap-5 p-2.5 pt-10 bg-white rounded-t-[60px] relative pb-30'>
               <Nav/>
            </div>
        </div>
    )
}
