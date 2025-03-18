import React from 'react'

const SingleMessage = ({ message, userId, isGroupChat, showUserDetails }) => {
    return (
        <div className={`flex flex-col w-fit ${message.sender._id === userId ? 'self-end' : 'self-start'}`}
        >
            {(isGroupChat && message.sender._id !== userId && showUserDetails) &&
            <div className='flex items-center gap-1 pl-2 pb-1'>
                <img className='w-7 h-7 border-1 border-slate-300 rounded-full' src={message.sender.profilePicture}/>
                <span className='text-sm text-slate-600'>{message.sender.name}</span>
            </div>
            }

            <p className={`py-1 px-6 rounded-3xl flex items-center justify-center ${message.sender._id === userId ? 'bg-[#009DFF] text-white mr-2' : 'bg-[#E7E7E7] ml-2'}`}>
                {message.content}
            </p>

            <div className={`w-3 h-3 rounded-full ${message.sender._id === userId ? 'bg-[#009DFF] self-end' : 'bg-[#E7E7E7]'}`}>
            </div>

        </div>
    )
}

export default SingleMessage