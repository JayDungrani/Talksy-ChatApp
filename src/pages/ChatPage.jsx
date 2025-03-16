import React from 'react'
import AllChatList from '../components/AllChatList'
import { useSelector } from 'react-redux'

const ChatPage = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  return (
    <>
      {isAuthenticated &&
        <div className='overflow-auto'>
          <div className='w-full h-full bg-slate-100'>
            {/* <AllChatList/> */}
          </div>
        </div>
      }
    </>
  )
}

export default ChatPage