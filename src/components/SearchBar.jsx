import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { IoSearch } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { Tooltip } from '@mui/joy';
import FriendReqButton from './FriendReqButton';
import { RxCross2 } from "react-icons/rx";

const SearchBar = () => {
    const [query, setQuery] = useState("")
    const [users, setUsers] = useState([])
    const [showList, setShowList] = useState(false)
    const [listMessage, setListMessage] = useState("Search User...")

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`/api/user/searchlist?search=${query}`, { withCredentials: true });
            setUsers(data.usersList)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (query) {
            fetchUsers();
            if (users.length === 0) {
                setListMessage("No User Found!")
            }
        } else {
            setUsers([]);
            setListMessage("Search User!")
        }
    }, [query]);

    return (
        <>
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-2 w-full'>

                    <IoSearch className='text-slate-500 text-xl' />
                    <input
                        type='text'
                        placeholder='Search..'
                        className='outline-none text-slate-700 py-3 w-full'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowList(true)}
                    // onBlur={() => setShowList(false)}
                    ></input>
                </div>
                <RxCross2 className='text-black text-2xl justify-self-end cursor-pointer' onClick={() => {
                    setShowList(false); setQuery("")
                }} />
            </div>

            <div className='absolute top-15 left-0 w-screen flex items-center justify-center shadow-md shadow-slate-400 z-2 lg:w-auto lg:top-20 lg:left-auto lg:px-2 bg-slate-200 overflow-auto'>

                <ul className={`px-3 w-3/3 ${!showList && 'hidden'}`}>

                    {(showList && users.length === 0) && <p className='text-center text-slate-500 p-3'>{listMessage}</p>}
                    <label></label>
                    {users.map((user, index) => 
                            <li key={user._id} className={`flex gap-3 border-b-2 justify-between items-center border-b-slate-300 py-3  ${index === 0 && 'py-0 pb-3'}`}>
                                <div className='flex items-center gap-3'>
                                    <img src={user.profilePicture} className='w-13 h-13 rounded-full' />
                                    <div className='flex flex-col'>
                                        <p className='text-slate-700 font-semibold'>{user.name}</p>
                                        <p className='text-slate-500'>{user.status}</p>
                                    </div>

                                </div>
                                <Tooltip
                                    title={user.isFriend ? "Friends Already!" : "Send Friend Request"}
                                    color='neutral'
                                    placement='top'
                                    variant='solid'
                                >
                                    <div className={`text-white cursor-pointer rounded-full text-sm ${user.isFriend ? 'bg-slate-400 p-2' : 'bg-blue-500'}`}>
                                        {user.isFriend ?
                                            <MdOutlineDone className='font-bold' />
                                            :
                                            <FriendReqButton receiverId={user._id} />
                                        }
                                    </div>
                                </Tooltip>
                            </li>
                        )}

                </ul>
            </div>
        </>
    )
}

export default SearchBar