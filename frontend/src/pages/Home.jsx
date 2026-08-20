import React from 'react'
import LeftHome from '../components/LeftHome'
import RightHome from '../components/RightHome'
import Feed from '../components/Feed'

function Home() {
  return (
    <div className='flex min-h-screen w-full bg-background'>
      <LeftHome />
      <Feed />
      <RightHome />
    </div>
  )
}

export default Home
