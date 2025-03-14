import React, { useState } from 'react'
import SingleChat from './SingleChat'

const AllChatList = () => {
  const [chatList, setChatList] = useState([
    {
      name: "Jay",
      profilePicture: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
      chatName: "Yug",
      unreadMessages: 3,
      latestMessage: {
        content: "latest message"
      },
      latestTime: "today"
    },
    {
      name: "Jay",
      profilePicture: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
      chatName: "Yug",
      unreadMessages: 3,
      latestMessage: {
        content: "latest message"
      },
      latestTime: "today"
    },
    {
      name: "Jay",
      profilePicture: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
      chatName: "Yug",
      unreadMessages: 3,
      latestMessage: {
        content: "latest message"
      },
      latestTime: "today"
    }
  ])
  return (
    <div className='p-4 bg-slate-100'>
      {chatList.map((chat) =>
        <SingleChat chat={chat}/>
      )}
      {chatList.map((chat) =>
        <SingleChat chat={chat}/>
      )}
      {chatList.map((chat) =>
        <SingleChat chat={chat}/>
      )}
    </div>
  )
}

export default AllChatList
