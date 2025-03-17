import React from 'react'
import { useDispatch } from 'react-redux';
import { fetchChat } from '../redux/chatSlice';

const SingleChat = ({ profilePicture, name, latestMessage, latestTime, unreadMessages, id }) => {
  const dispatch = useDispatch()

  const convertToIST = (utcTimestamp) => {
    const date = new Date(utcTimestamp);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const handleUserClick = async () => {
    try {
      await dispatch(fetchChat(id)).unwrap()
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className='flex items-center justify-between text-slate-800 border-b-1 border-slate-300 p-2 cursor-pointer' onClick={handleUserClick}>
      <div className='flex items-center gap-3'>
        <img src={profilePicture} className='w-12 rounded-full' />
        <div className=''>
          <p className='text-md font-semibold'>{name}</p>
          <p className='text-slate-600 text-sm'>{latestMessage}</p>
        </div>
      </div>

      <div className='flex flex-col items-end'>
        <p className='text-slate-500 text-sm'>{convertToIST(latestTime)}</p>
        <p className={`bg-red-600 text-white flex items-center justify-center w-5 h-5 rounded-full ${unreadMessages === 0 && 'invisible'} relative top-1`}>
          <span>
            {unreadMessages}
          </span>
        </p>
      </div>
    </div>
  )
}

export default SingleChat
