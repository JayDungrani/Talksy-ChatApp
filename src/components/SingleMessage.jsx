import React from 'react'

const SingleMessage = ({ message, userId, isGroupChat, showUserDetails }) => {
    
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

    return (
        <div className={`flex flex-col w-fit ${message.sender._id === userId ? 'self-end' : 'self-start'}`}
        >
            {(isGroupChat && message.sender._id !== userId && showUserDetails) &&
                <div className='flex items-center gap-1 pl-2 pb-1'>
                    <img className='w-7 h-7 border-1 border-slate-300 rounded-full' src={message.sender.profilePicture} />
                    <span className='text-sm text-slate-600'>{message.sender.name}</span>
                </div>
            }

            <p className={`py-1 px-6 rounded-3xl flex items-center justify-center gap-2 ${message.sender._id === userId ? 'bg-[#009DFF] text-white mr-2' : 'bg-[#E7E7E7] ml-2'}`}>
                {message.content}
                <span className={`text-xs self-end ${message.sender._id === userId ? 'text-slate-200' : 'text-slate-400'}`}>
                    {convertToIST(message.updatedAt)}
                </span>
            </p>

            <div className={`w-3 h-3 rounded-full ${message.sender._id === userId ? 'bg-[#009DFF] self-end' : 'bg-[#E7E7E7]'}`}>
            </div>

        </div>
    )
}

export default SingleMessage