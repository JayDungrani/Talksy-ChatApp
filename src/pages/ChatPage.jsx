import React, { useEffect, useState } from 'react'
import AllChatList from '../components/AllChatList'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChatList } from '../redux/chatSlice';
import SearchBar from '../components/SearchBar';
import ChatWithMessage from '../components/ChatWithMessage';
import Loading from '../components/Loading';
import { CircularProgress } from '@mui/joy';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { chatList, openedChat, listLoading, singleChatLoading } = useSelector(state => state.chat);

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
        <div className='overflow-hidden max-h-screen lg:grid lg:grid-cols-[1fr_2fr] gap-6 w-full p-1 h-full'>
          <div className='w-full h-full bg-slate-100 lg:hidden'>
            <Loading showLoading={singleChatLoading} />
            {!openedChat ?
              <AllChatList chatList={chatList} user={user} listLoading={listLoading} />
              : <ChatWithMessage />}
          </div>
          <div className='max-lg:hidden flex flex-col items-center gap-5 w-full'>
            <div className='bg-white rounded-2xl gap-3 px-3 shadow-sm shadow-slate-300 w-full'>
              <SearchBar />
            </div>
            <div className='w-full rounded-2xl shadow-sm shadow-slate-300 bg-white'>
              <p className='px-5 pt-3 text-2xl font-semibold'>Chats</p>
              <AllChatList chatList={chatList} user={user} listLoading={listLoading} />
            </div>
          </div>
          <div className='rounded-2xl shadow-sm shadow-slate-300 bg-white max-lg:hidden'>
            {singleChatLoading &&
              <div className='w-full h-full flex items-center justify-center'>
                <CircularProgress size='lg' />
              </div>
            }
            {(!openedChat && !singleChatLoading) &&
              <p className='h-full flex items-center justify-center text-4xl pb-40'>
                Open a chat to start a conversation!
              </p> 
            }
            {openedChat && <ChatWithMessage />}
          </div>
        </div>
      }
    </>
  )
}

export default ChatPage