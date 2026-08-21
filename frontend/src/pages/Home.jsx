import React from 'react'
import LeftHome from '../components/LeftHome'
import Feed from '../components/Feed'
import Nav from '../components/Nav'
import TopBar from '../components/TopBar'

function Home() {
  return (
    <div className='flex min-h-svh w-full bg-background'>
      <LeftHome />
      <div className='flex min-h-svh min-w-0 flex-1 flex-col'>
        <TopBar crumb='Home' trail='All posts' />
        <Feed />
        <Nav />
      </div>
    </div>
  )
}

export default Home
