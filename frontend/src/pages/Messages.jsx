import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiSearch, FiImage, FiSmile, FiMoreHorizontal } from "react-icons/fi"
import { IoSend } from "react-icons/io5"
import { serverUrl } from '../App'
import { setConversations, setSelectedUser, setMessages, addMessage } from '../redux/messageSlice'
import Avatar from '../components/Avatar'

const clock = (date) =>
  new Date(date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })

function Messages() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const { conversations, selectedUser, messages, onlineUsers } = useSelector(state => state.message)

  const [query, setQuery] = useState("")
  const [text, setText] = useState("")
  //on a narrow screen the two panes share the space, so only one shows at a
  //time. which one is derived from the selection rather than mirrored into an
  //effect, so arriving with a chat already picked opens straight on the thread
  const [showList, setShowList] = useState(false)
  const threadOpen = Boolean(selectedUser) && !showList
  const bottomRef = useRef(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/message/conversations`, { withCredentials: true })
        dispatch(setConversations(response.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchConversations()
  }, [dispatch])

  useEffect(() => {
    if (!selectedUser?._id) return
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/message/${selectedUser._id}`, { withCredentials: true })
        dispatch(setMessages(response.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessages()
  }, [selectedUser?._id, dispatch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const rows = useMemo(() => {
    return (conversations || [])
      .map(conversation => ({
        conversation,
        otherUser: conversation.participants?.find(p => p._id !== userData._id)
      }))
      .filter(row => row.otherUser)
      .filter(row => {
        const haystack = `${row.otherUser.name} ${row.otherUser.userName}`.toLowerCase()
        return haystack.includes(query.trim().toLowerCase())
      })
  }, [conversations, userData._id, query])

  const handleSend = async (event) => {
    event?.preventDefault()
    if (!text.trim() || !selectedUser?._id) return
    try {
      const response = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, { text }, { withCredentials: true })
      dispatch(addMessage(response.data))
      setText("")
    } catch (error) {
      console.log(error)
    }
  }

  const openThread = (otherUser) => {
    dispatch(setSelectedUser(otherUser))
    setShowList(false)
  }

  const isOnline = selectedUser?._id ? onlineUsers.includes(selectedUser._id) : false

  return (
    <div className='min-h-svh bg-background'>

      <header className='sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8'>
        <div className='flex min-w-0 items-center gap-3'>
          <button
            aria-label='Back to feed'
            className='grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground'
            onClick={() => navigate("/")}
          >
            <FiArrowLeft className='size-4' />
          </button>
          <div className='min-w-0'>
            <p className='eyebrow mb-1'>Direct</p>
            <h1 className='truncate font-display text-lg font-semibold tracking-tight text-foreground'>Messages</h1>
          </div>
        </div>
        <Avatar user={userData} size='size-9' text='text-xs' ring='ring-2 ring-background' />
      </header>

      <main className='mx-auto w-full max-w-[1280px] px-0 py-0 sm:px-6 sm:py-6 lg:px-8'>
        <div className='grid h-[calc(100svh-72px)] overflow-hidden border-border/80 bg-card sm:h-[calc(100svh-120px)] sm:rounded-2xl sm:border sm:shadow-[0_20px_60px_-45px_var(--shadow-color)] lg:grid-cols-[320px_minmax(0,1fr)]'>

          <aside
            aria-label='Conversations'
            className={`min-h-0 flex-col border-border/70 lg:flex lg:border-r ${threadOpen ? "hidden" : "flex"}`}
          >
            <div className='border-b border-border/70 p-4'>
              <label className='relative block'>
                <FiSearch className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label='Search messages'
                  placeholder='Search messages'
                  className='h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10'
                />
              </label>
            </div>

            <div className='min-h-0 flex-1 overflow-y-auto p-2 hide-scrollbar'>
              {rows.length === 0 &&
                <p className='px-3 py-8 text-center text-xs text-muted-foreground'>
                  {conversations?.length ? "No conversations found." : "No conversations yet. Open a profile and tap Message."}
                </p>}

              {rows.map(({ conversation, otherUser }) =>
                <button
                  key={conversation._id}
                  type='button'
                  onClick={() => openThread(otherUser)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${otherUser._id === selectedUser?._id ? "bg-accent" : "hover:bg-muted"}`}
                >
                  <div className='relative shrink-0'>
                    <Avatar user={otherUser} size='size-11' />
                    {onlineUsers.includes(otherUser._id) &&
                      <span className='absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-primary' />}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='truncate text-sm font-semibold text-foreground'>{otherUser.name || otherUser.userName}</p>
                      {conversation.lastMessage?.createdAt &&
                        <span className='shrink-0 text-[10px] text-muted-foreground'>{clock(conversation.lastMessage.createdAt)}</span>}
                    </div>
                    <p className='mt-0.5 truncate text-xs text-muted-foreground'>
                      {conversation.lastMessage?.sender === userData._id ? "You: " : ""}
                      {conversation.lastMessage?.text || "Say hi 👋"}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </aside>

          <section
            aria-label={selectedUser ? `Conversation with ${selectedUser.userName}` : "Conversation"}
            className={`min-h-0 flex-col bg-surface lg:flex ${threadOpen ? "flex" : "hidden"}`}
          >
            {!selectedUser
              ? <div className='grid flex-1 place-items-center px-6 text-center'>
                <div>
                  <p className='font-display text-base font-semibold text-foreground'>No conversation open</p>
                  <p className='mt-1 text-xs text-muted-foreground'>Pick someone on the left to start chatting.</p>
                </div>
              </div>
              : <>
                <div className='flex items-center justify-between gap-3 border-b border-border/70 bg-card px-4 py-3'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <button
                      aria-label='Back to conversations'
                      className='grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent lg:hidden'
                      onClick={() => setShowList(true)}
                    >
                      <FiArrowLeft className='size-4' />
                    </button>
                    <Avatar user={selectedUser} size='size-10' onClick={() => navigate(`/profile/${selectedUser.userName}`)} />
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-semibold text-foreground'>{selectedUser.name || selectedUser.userName}</p>
                      <p className='truncate text-[11px] text-muted-foreground'>{isOnline ? "Active now" : "Offline"}</p>
                    </div>
                  </div>
                  <button aria-label='Conversation details' className='grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent'>
                    <FiMoreHorizontal className='size-4' />
                  </button>
                </div>

                <div className='min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-6 hide-scrollbar sm:px-6'>
                  {!messages?.length &&
                    <p className='pb-2 text-center text-[11px] text-muted-foreground'>No messages yet — say hello.</p>}

                  {messages?.map((message, index) => {
                    const isOwn = message.sender === userData._id
                    return (
                      <div key={message._id || index} className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                        {!isOwn && <Avatar user={selectedUser} size='size-7' text='text-[9px]' />}
                        <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-6 sm:max-w-[62%] ${isOwn
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border border-border/70 bg-card text-foreground"}`}>
                          <p className='break-words'>{message.text}</p>
                          <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            <span>{clock(message.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>

                <form className='flex items-end gap-2 border-t border-border/70 bg-card px-3 py-3 sm:px-4' onSubmit={handleSend}>
                  <button type='button' aria-label='Add photo' className='grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent'>
                    <FiImage className='size-4' />
                  </button>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    rows={1}
                    placeholder={`Message ${(selectedUser.name || selectedUser.userName).split(" ")[0]}...`}
                    aria-label='Write a message'
                    className='max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10'
                  />
                  <button type='button' aria-label='Add emoji' className='grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent'>
                    <FiSmile className='size-4' />
                  </button>
                  <button
                    type='submit'
                    aria-label='Send message'
                    disabled={!text.trim()}
                    className='grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40'
                  >
                    <IoSend className='size-4' />
                  </button>
                </form>
              </>}
          </section>

        </div>
      </main>
    </div>
  )
}

export default Messages
