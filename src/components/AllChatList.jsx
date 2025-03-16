import React from 'react'
import SingleChat from './SingleChat'

const AllChatList = ({ chatList, user }) => {

  const getFriend = (members)=>{
    return members[0]._id === user._id ? members[1] : members[0]
  }
  return (
    <div className='p-4 bg-slate-100 lg:bg-white lg:px-4 lg:py-1 lg:rounded-2xl'>
      {chatList.length === 0 && <p>No chats available. Create a new conversation now!</p>}
      {chatList.map((chat) => {
        return chat.isGroupChat ?
          <SingleChat
            name={chat.chatName}
            profilePicture={chat.profilePicture}
            latestMessage={chat.latestMessage.content}
            latestTime={chat.updatedAt}
            unreadMessages={0}
            key={chat._id}
          /> :
          <SingleChat
          name = {getFriend(chat.members).name}
          profilePicture={getFriend(chat.members).profilePicture}
          latestMessage={chat.latestMessage.content}
          latestTime={chat.updatedAt}
          unreadMessages={chat._id === '67d6cd384d84f7345bca7572' ? 1 : 0}
          key={chat._id}
          />
           
      }
      )}
    </div>
  )
}

export default AllChatList
