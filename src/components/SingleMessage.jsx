import React from 'react'

const SingleMessage = ({ message, userId }) => {

    return (
        <div className={`flex flex-col w-fit ${message.sender._id === userId ? 'self-end' : 'self-start'}`}
        >
            <p className={`py-1 px-6 rounded-3xl flex items-center justify-center ${message.sender._id === userId ? 'bg-[#009DFF] text-white mr-2' : 'bg-[#E7E7E7] ml-2'}`}>
                {message.content}
            </p>

            <div className={`w-3 h-3 rounded-full ${message.sender._id === userId ? 'bg-[#009DFF] self-end' : 'bg-[#E7E7E7]'}`}>
            </div>

        </div>
    )
}

export default SingleMessage