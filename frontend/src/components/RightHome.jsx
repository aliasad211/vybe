import React from 'react'
import { useSelector } from 'react-redux'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

function RightHome() {
  const { selectedUser } = useSelector(state => state.message)

  return (
    <div className='w-[25%] hidden lg:block min-h-screen bg-black border-l-2 border-gray-700'>
        {selectedUser ? <ChatWindow/> : <ConversationList/>}
    </div>
  )
}

export default RightHome
