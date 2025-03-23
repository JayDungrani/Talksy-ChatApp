import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addGroupMember, createGroup, fetchChatList, removeGroupMember, updateGroup } from '../redux/chatSlice';
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Tooltip } from '@mui/joy';
import { FaEdit } from "react-icons/fa";
import Loading from './Loading';

const EditGroupBox = ({ openedChat, setShowEditGroup }) => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [groupName, setGroupName] = useState(openedChat.chatName)
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(openedChat.profilePicture);
    const [memberList, setMemberList] = useState(openedChat.members);
    const [query, setQuery] = useState("")
    const [users, setUsers] = useState([])
    const [listMessage, setListMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleUploadImage = async () => {
        try {
            setLoading(true)
            if (!selectedFile) return;

            const formData = new FormData();
            formData.append("image", selectedFile);

            const { data } = await axios.post("/api/user/picture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            return data;
        } catch (error) {
            console.error("Error uploading image", error);
            return null;
        };
    }

    const handleSubmit = async () => {
        let details;
        if (preview !== openedChat.profilePicture) {
            details = {
                chatId: openedChat._id,
                profilePicture: await handleUploadImage(),
                chatName: groupName
            }
        }
        else {
            details = {
                chatId: openedChat._id,
                profilePicture: openedChat.profilePicture,
                chatName: groupName
            }
        }
        await dispatch(updateGroup(details)).unwrap()
        dispatch(fetchChatList())
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

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`/api/user/searchlist?search=${query}`, { withCredentials: true });
            setUsers(data.usersList)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Preview selected image
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            await dispatch(removeGroupMember({ chatId: openedChat._id, memberId: userId })).unwrap()
            setMemberList(memberList.filter(i => i._id !== userId))
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleAddUser = async (userId) => {
        try {
            await dispatch(addGroupMember({ chatId: openedChat._id, memberId: userId })).unwrap()
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
            <Loading showLoading={loading} />
            <div className='flex flex-col gap-2 p-2 bg-slate-50 rounded-lg shadow-lg shadow-slate-300'>
                <p className='self-center text-xl'>Edit Group</p>

                {/* profile Picture */}
                <div className='flex flex-col items-center gap-1 mb-2 my-1'>
                    <img src={preview} className='size-15 rounded-full border-2 border-blue-800 object-cover' />
                    <Tooltip title='Change Picture' color='primary' placement='top' variant='solid'>
                        <label className="rounded-sm text-white cursor-pointer px-3 py-1 bg-blue-500 hover:bg-blue-600">
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            {/* <span className='text-sm'>Edit Picture</span> */}
                            <FaEdit />
                        </label>
                    </Tooltip>
                </div>

                {/* Change Name */}
                <div>
                    <span>Group Name : </span>
                    <input
                        type='text'
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className='px-2 py-1 bg-white outline-blue-500 rounded-sm shadow-sm shadow-slate-200'
                    />
                </div>

                {/* change members */}
                <p className='self-start'>Members : </p>
                <div className='grid grid-cols-3 max-h-[88px] overflow-auto gap-1 w-full'>
                    {memberList.length === 0 && <p>No Members </p>}
                    {memberList.map(member =>
                        <div key={member._id} className='flex items-center gap-1 bg-blue-100 p-1 rounded-lg'>
                            <img src={member.profilePicture} className='size-8 rounded-full' />
                            <span className='text-sm'>{member.name}</span>
                        </div>
                    )}
                </div>

                {/* search bar */}
                <div className='flex items-center justify-between w-full bg-white shadow-sm shadow-slate-200 rounded-3xl px-3 mt-2'>
                    <div className='flex items-center gap-2 w-full'>
                        <IoSearch className='text-slate-600 text-xl' />
                        <input
                            type='text'
                            placeholder='Search..'
                            className='outline-none text-slate-700 py-1 w-full'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        // onBlur={() => setShowList(false)}
                        ></input>
                    </div>
                    <RxCross2 className='text-slate-600 text-2xl justify-self-end cursor-pointer' onClick={() => setQuery("")} />
                </div>

                <div className='max-h-35 flex flex-col bg-white shadow-sm shadow-slate-200 w-full overflow-auto p-2 gap-2 rounded-md'>
                    {users.length === 0 && <p className='text-slate-400'>{listMessage}</p>}
                    {users.map(member => {
                        if (user._id !== member._id) {
                            return <div className='flex items-center justify-between' key={member._id}>
                                <div className='flex gap-2 items-center'>
                                    <img src={member.profilePicture} className='size-10 rounded-full' />
                                    <span>{member.name}</span>
                                </div>
                                {memberList.some(i => i._id === member._id) ?
                                    <button className='bg-rose-500 text-white py-1 px-2 rounded-lg text-md cursor-pointer hover:bg-rose-600'
                                        onClick={() => handleRemoveUser(member._id)}>Remove</button>
                                    :
                                    <button 
                                    className='bg-blue-500 text-white py-1 px-2 rounded-lg text-md cursor-pointer hover:bg-blue-600'
                                    onClick={() =>{
                                            handleAddUser(member._id)
                                            setMemberList([...memberList, {
                                                name: member.name,
                                                profilePicture: member.profilePicture,
                                                _id: member._id
                                            }])
                                    }
                                    }>
                                        Add Member
                                    </button>
                                }
                            </div>
                        }
                    }
                    )}
                </div>

                <div className='flex items-center gap-2'>
                    <button className='bg-rose-400 py-1 px-3 rounded-md text-white hover:bg-rose-500 cursor-pointer' onClick={() => setShowEditGroup(false)}>Cancel</button>
                    <button className='bg-blue-500 py-1 px-3 rounded-md text-white hover:bg-blue-600 cursor-pointer' onClick={() => {
                        handleSubmit()
                        setShowEditGroup(false)
                        }}>Save</button>
                </div>

            </div>
        </div>
    )
}

export default EditGroupBox