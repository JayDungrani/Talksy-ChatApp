import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowBack } from "react-icons/io";
import { clearOpenedChat, fetchChatList, joinRoom } from '../redux/chatSlice';
import { fetchMessages, sendMessage } from '../redux/messageSlice';
import SingleMessage from './SingleMessage';
import { IoSend } from "react-icons/io5";
import socket from '../socket';

const ChatWithMessage = () => {
  const dispatch = useDispatch()
  const { openedChat } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.auth)
  const { messageList } = useSelector(state => state.message)
  const [chatProfile, setChatProfile] = useState({})
  const [content, setContent] = useState("")

  const messagesEndRef = useRef(null);

  const getFriend = () => {
    return openedChat.members[0]._id === user._id ? openedChat.members[1] : openedChat.members[0]
  }

  const fetchMessage = async () => {
    await dispatch(fetchMessages(openedChat._id)).unwrap()
  }

  const handleBackClick = () => {
    dispatch(clearOpenedChat())
    dispatch(fetchChatList())
  }

  const handleSendMessage = async () => {
    if (content !== "") {
      try {
        const data = await dispatch(sendMessage({ chatId: openedChat._id, content: content })).unwrap()
        socket.emit("sendMessage", (data))
        setContent("")
      } catch (error) {
        console.log(error.message)
      }
    }
  }

  const convertToIST = (utcTimestamp) => {
    const date = new Date(utcTimestamp);

    // Convert to IST using toLocaleString with 'Asia/Kolkata' timezone
    const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const now = new Date();
    const nowIST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const messageDate = istDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const today = nowIST.toISOString().split('T')[0];

    nowIST.setDate(nowIST.getDate() - 1);
    const yesterday = nowIST.toISOString().split('T')[0];

    if (messageDate === today) {
        return istDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (messageDate === yesterday) {
        return 'Yesterday';
    } else {
        return istDate.toLocaleDateString('en-IN');
    }
};


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList])

  useEffect(() => {
    if (openedChat.isGroupChat) {
      setChatProfile({
        name: openedChat.chatName,
        profilePicture: openedChat.profilePicture,
        members: openedChat.members
      })
    }
    else {
      setChatProfile(getFriend)
    }
    fetchMessage()
    dispatch(joinRoom(openedChat._id))
  }, [openedChat])

  return (
    <div
      className='px-3 overflow-hidden absolute top-0 left-0 w-screen h-screen bg-white flex flex-col
      lg:static lg:w-full lg:h-full lg:rounded-2xl'>

      <div className='flex justify-between items-center py-3 border-b-1 border-b-slate-400'>
        <div className='flex items-center'>
          <IoMdArrowBack className='text-3xl lg:hidden' onClick={handleBackClick} />
          <img src={chatProfile.profilePicture} className='w-12 h-12 rounded-full border-2 border-[#009DFF]' />
          <div className='pl-3'>
            <p className='text-xl font-semibold text-slate-700'>{chatProfile.name}</p>
            {!openedChat.isGroupChat && <p className={`${chatProfile.isOnline ? "text-blue-400" : "text-slate-500"} text-sm`}>{chatProfile.isOnline ? "online" : "offline"}</p>}
          </div>
        </div>
        <div>
          {(!chatProfile.isOnline && chatProfile.updatedAt) &&
          <p className='text-slate-500 '>
            Last seen : {convertToIST(chatProfile.updatedAt)}
          </p>}
        </div>
      </div>

      <div className='flex flex-col justify-between h-17/20'>

        {(messageList.length !== 0) ?
          <div className='flex flex-col gap-4 overflow-y-auto max-h-9/10 p-2'>
            {messageList.map((message, index) => {
              const showUserDetails =
                index === 0 || messageList[index - 1].sender._id !== message.sender._id;

              return (<SingleMessage
                message={message}
                userId={user._id}
                key={message._id}
                isGroupChat={openedChat.isGroupChat}
                showUserDetails={showUserDetails}
              />)
            })}
            <div ref={messagesEndRef} />
          </div>
          :
          <p className='text-2xl text-slate-500 self-center'>No messages yet!</p>
        }

        <div className='flex items-center gap-2 max-lg:absolute max-lg:bottom-5 max-lg:w-full max-lg:left-0 max-lg:px-3'>
          <input
            type='text'
            placeholder='Type your message here...'
            className='bg-[#EFF6FC] py-2 px-5 rounded-xl w-full'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className='bg-[#006CD0] rounded-full' onClick={handleSendMessage}>
            <IoSend className='text-2xl cursor-pointer text-white m-2 ' />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChatWithMessage