import React, { useEffect, useState } from 'react'
import AllChatList from '../components/AllChatList'
import { useDispatch, useSelector } from 'react-redux'
import { addMessageInChatList, fetchChatList, setUserOffline, setUserOnline } from '../redux/chatSlice';
import SearchBar from '../components/SearchBar';
import ChatWithMessage from '../components/ChatWithMessage';
import Loading from '../components/Loading';
import { CircularProgress } from '@mui/joy';
import socket from '../socket';
import { addMessage } from '../redux/messageSlice';
import CreateGroupBox from '../components/CreateGroupBox';

const ChatPage = () => {

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { chatList, openedChat, listLoading, singleChatLoading } = useSelector(state => state.chat);
  const [showGroupBox, setShowGroupBox] = useState(false)

  const fetchChats = async () => {
    try {
      await dispatch(fetchChatList()).unwrap()
    } catch (error) {
      console.error("Failed to fetch chats :", error)
    }
  }

  useEffect(() => {
    fetchChats();
    socket.emit('userConnected', (user._id))

    const handleUserOnline = (onlineUserId) => {
      dispatch(setUserOnline(onlineUserId));
    };

    const handleUserOffline = (offlineUserId) => {
      dispatch(setUserOffline(offlineUserId))
    };

    const handleNewMessage = (message) => {
      dispatch(addMessage(message))
    }

    const handleMessageInChatList = async (message) => {
      let exists = await chatList.some(chat => chat._id === message.chat)
      if (exists && !openedChat) {
        dispatch(addMessageInChatList(message))
      }
      else {
        return;
      }
    }

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("new_message", handleNewMessage);
    socket.on("globalMessage", (handleMessageInChatList))

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("new_message", handleNewMessage);
      socket.off("globalMessage", handleMessageInChatList)
    };
  }, []);

  return (
    <>
      {isAuthenticated &&
        <div className='overflow-auto lg:overflow-hidden max-lg:max-h-screen lg:grid lg:grid-cols-[1fr_2fr] gap-6 w-full p-1 h-full'>

          <div className='w-full h-full bg-slate-100 lg:hidden flex flex-col'>
          <button className='bg-[#009DFF] text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-[#0077E7] w-30 self-start'
                  onClick={() => setShowGroupBox(true)}>Create Group
          </button>
            <Loading showLoading={singleChatLoading} />
            {!openedChat ?
              <AllChatList chatList={chatList} user={user} listLoading={listLoading} />
              : <ChatWithMessage />}
          </div>

          <div className='max-lg:hidden flex flex-col items-center gap-5 w-full'>
            <div className='bg-white rounded-2xl gap-3 px-3 shadow-sm shadow-slate-300 w-full'>
              <SearchBar />
            </div>

            <div className='w-full rounded-2xl shadow-sm shadow-slate-300 bg-white overflow-auto max-h-[80vh]'>
              <div className='flex items-center justify-between px-5 py-3 border-b-1 border-slate-200'>
                <p className='text-2xl font-semibold'>Chats</p>
                <button className='bg-[#009DFF] text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-[#0077E7]'
                  onClick={() => setShowGroupBox(true)}>Create Group
                </button>
              </div>
              <AllChatList chatList={chatList} user={user} listLoading={listLoading} />
            </div>
          </div>

          {/* createGroupBox */}
          {showGroupBox && <CreateGroupBox setShowGroupBox={setShowGroupBox}/>}

          <div className='max-h-[92vh] rounded-2xl shadow-sm shadow-slate-300 bg-white max-lg:hidden'>
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