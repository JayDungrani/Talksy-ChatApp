import React from 'react'

const SingleChat = ({ profilePicture, name, latestMessage, latestTime, unreadMessages }) => {
  const convertToIST = (utcTimestamp) => {
    const date = new Date(utcTimestamp);
    
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };
  
  return (
    <div className='flex items-center justify-between text-slate-800 border-b-1 border-slate-300 p-2 cursor-pointer'>
      <div className='flex items-center gap-3'>
      <img src={profilePicture} className='w-12 rounded-full' />
      <div className=''>
        <p className='text-md font-semibold'>{name}</p>
        <p className='text-slate-600 text-sm'>{latestMessage}</p>
      </div>
      </div>

      <div className='flex flex-col items-end'>
        <p className='text-slate-500 text-sm'>{convertToIST(latestTime)}</p>
        <p className={`bg-red-600 text-white flex items-center justify-center w-6 rounded-full ${unreadMessages === 0 && 'invisible'} relative top-1`}>
          <span>
            {unreadMessages}
          </span>
        </p>
      </div>
    </div>
  )
}

export default SingleChat
