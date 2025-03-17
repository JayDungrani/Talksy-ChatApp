import React from 'react'
import SingleChat from './SingleChat'
import { CircularProgress } from '@mui/joy'

const AllChatList = ({ chatList, user, listLoading }) => {

  const getFriend = (members) => {
    return members[0]._id === user._id ? members[1] : members[0]
  }
  return (
    <div className='p-4 bg-slate-100 lg:bg-white lg:px-4 lg:py-1 lg:rounded-2xl'>
      {listLoading &&
        <div className='w-full flex items-cetner justify-center'>
          <CircularProgress size='md' />
        </div>
      }
      {chatList.length === 0 && <p>No chats available. Create a new conversation now!</p>}
      {chatList.map((chat) => {
        return chat.isGroupChat ?
          <SingleChat
            name={chat.chatName}
            profilePicture={chat.profilePicture}
            latestMessage={chat.latestMessage.content}
            latestTime={chat.updatedAt}
            unreadMessages={chat.unreadCount}
            key={chat._id}
            id={chat._id}
          /> :
          <SingleChat
            name={getFriend(chat.members).name}
            profilePicture={getFriend(chat.members).profilePicture}
            latestMessage={chat.latestMessage.content}
            latestTime={chat.updatedAt}
            unreadMessages={chat.unreadCount}
            key={chat._id}
            id={chat._id}
          />
      }
      )}
    </div>
  )
}

export default AllChatList
