import React from 'react'

const SingleChat = ({chat}) => {
  return (
    <div className='flex items-center justify-between gap-3 text-slate-800 border-b-1 border-slate-600 p-2'>
    <img src={chat.profilePicture} className='w-13 rounded-full'/>
    <div className='w-full'>
      <p className='text-2xl font-semibold'>{chat.name}</p>
      <p className='text-slate-600'>{chat.latestMessage.content}</p>
    </div>
    <div className='flex flex-col items-end'>
      <p className='text-slate-500'>{chat.latestTime}</p>
      <p className='bg-red-600 text-white text-center w-6 rounded-full'>{chat.unreadMessages}</p>
    </div>
  </div>
  )
}

export default SingleChat
