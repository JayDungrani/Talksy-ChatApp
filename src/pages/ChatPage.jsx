import React, { useEffect, useState } from 'react'
import AllChatList from '../components/AllChatList'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChatList } from '../redux/chatSlice';
import SearchBar from '../components/SearchBar';

const ChatPage = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { normalChatList, groupChatList } = useSelector(state => state.chat);
  const [sortedChats, setSortedChats] = useState([])

  useEffect(() => {
    setSortedChats(() => [...normalChatList, ...groupChatList].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    )
  }, [normalChatList, groupChatList])

  const fetchChats = async () => {
    try {
      await dispatch(fetchChatList()).unwrap()
    } catch (error) {
      console.error("Failed to fetch chats :", error)
    }
  }
  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <>
      {isAuthenticated &&
        <div className='overflow-auto lg:grid lg:grid-cols-[1fr_2fr] gap-6 w-full p-1'>
          <div className='w-full h-full bg-slate-100 lg:hidden'>
            <AllChatList chatList={sortedChats} user={user} />
          </div>
          <div className='max-lg:hidden flex flex-col items-center gap-5 w-full'>
            <div className='bg-white flex items-center rounded-2xl gap-3 px-3 shadow-sm shadow-slate-300 w-full'>
              <SearchBar />
            </div>
            <div className='w-full rounded-2xl shadow-sm shadow-slate-300 bg-white'>
              <p className='px-5 pt-3 text-2xl font-semibold'>Chats</p>
              <AllChatList chatList={sortedChats} user={user}/>
            </div>
          </div>
          <div className='rounded-2xl shadow-sm shadow-slate-300'>
          </div>
        </div>
      }
    </>
  )
}

export default ChatPage