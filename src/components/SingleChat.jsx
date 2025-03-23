import React from 'react'
import { useDispatch } from 'react-redux';
import { clearOpenedChat, fetchChat } from '../redux/chatSlice';
import { setUnreadCountToZero } from '../redux/chatSlice';

const SingleChat = ({ profilePicture, name, latestMessage, latestTime, unreadMessages, id }) => {
  const dispatch = useDispatch()

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

  const handleUserClick = async () => {
    try {
      dispatch(setUnreadCountToZero(id))
      dispatch(clearOpenedChat())
      await dispatch(fetchChat(id)).unwrap()
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className='flex items-center justify-between text-slate-800 border-b-1 border-slate-300 px-2 pb-4 lg:py-4  cursor-pointer' onClick={handleUserClick}>
      <div className='flex items-center gap-3'>
        <img src={profilePicture} className='size-13 lg:size-12 rounded-full' />
        <div>
          <p className='text-xl lg:text-md font-semibold'>{name}</p>
          <p className='text-slate-600 text-sm'>{latestMessage}</p>
        </div>
      </div>

      <div className='flex flex-col items-end'>

        <p className='text-slate-500 text-sm'>{convertToIST(latestTime)}</p>
        <p className={`bg-red-600 text-white flex items-center justify-center w-5 h-5 rounded-full ${(unreadMessages === 0 || !unreadMessages) && 'invisible'} relative top-1`}>
          <span>
            {unreadMessages}
          </span>
        </p>
      </div>
    </div>
  )
}

export default SingleChat
