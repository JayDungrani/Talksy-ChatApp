import React from 'react'
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const SingleRequest = ({ name, profilePicture, acceptReq, rejectReq, notifId, status }) => {
    return (
        <div className='flex items-center justify-between p-3 w-full border-b-1 border-slate-300'>
            <div className='flex items-center gap-3'>
                <img src={profilePicture} className='size-12 rounded-full' />
                <span className='text-slate-800 text-2xl'>{name}</span>
            </div>
            {status === 'accepted' &&
                <span className="bg-green-300 p-2 rounded-lg cursor-pointer">Accepted</span>
            }
            {status === "rejected" &&
                <span className="bg-red-300 p-2 rounded-lg cursor-pointer">Rejected</span>
            }
            {status === "pending" && <div className='flex items-center gap-2 text-4xl'>
                <IoMdCheckmark
                    onClick={() => acceptReq(notifId)}
                    className='bg-blue-300 rounded-full p-2 cursor-pointer'
                />
                <RxCross2
                    onClick={() => rejectReq(notifId)}
                    className='bg-red-300 rounded-full p-2 cursor-pointer'
                />
            </div>
            }
        </div>
    )
}

export default SingleRequest