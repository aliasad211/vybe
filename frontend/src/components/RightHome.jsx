import React from 'react'
import { useSelector } from 'react-redux'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

function RightHome() {
  const { selectedUser } = useSelector(state => state.message)

  return (
    <aside className='hidden h-screen w-[26%] shrink-0 border-l border-border/70 bg-sidebar lg:block'>
      {selectedUser ? <ChatWindow /> : <ConversationList />}
    </aside>
  )
}

export default RightHome
