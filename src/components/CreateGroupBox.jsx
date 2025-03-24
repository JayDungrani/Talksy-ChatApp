import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup } from '../redux/chatSlice';
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Tooltip } from '@mui/joy';
import { FaEdit } from "react-icons/fa";
import Loading from './Loading';

const CreateGroupBox = ({setShowGroupBox}) => {
    const { user } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(false)
    const [chatName, setChatName] = useState("")
    const [selectedFile, setSelectedFile] = useState(null);
    const [memberList, setMemberList] = useState([{name : "You", id : user._id, profilePicture : user.profilePicture}]);
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [listMessage, setListMessage] = useState("Search User...");

    const [preview, setPreview] = useState("https://w7.pngwing.com/pngs/522/207/png-transparent-profile-icon-computer-icons-business-management-social-media-service-people-icon-blue-company-people.png");


    const dispatch = useDispatch()
    //for user search list
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

    //for upload data and profile url fetching
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Preview selected image
        }
    };

    const handleUploadImage = async () => {
        try {
            setLoading(true)
            if (!selectedFile) return;

            const formData = new FormData();
            formData.append("image", selectedFile);

            const { data } = await axios.post(`/api/user/picture`, formData, {
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
        try {
            const members = memberList.map(i => i.id)
            const profileUrl = await handleUploadImage()
            const groupDetails = {
                chatName: chatName,
                members : members,
                profilePicture: profileUrl,
            }
            await dispatch(createGroup(groupDetails)).unwrap()
            setLoading(false)
            setShowGroupBox(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='absolute top-0 left-0 w-full h-full flex items-start justify-center bg-black/20 py-10'>
            <Loading showLoading={loading}/>
            <div className='flex flex-col gap-2 bg-slate-50 p-3 rounded-lg items-center shadow-lg shadow-slate-400'>
                <p className='self-center text-2xl text-slate-600'>Create Group</p>
                {/* details form */}

                {/* image change */}
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

                <label className='w-fit flex items-center gap-2 rounded-sm my-1'>
                    <span className='text-slate-800'>Group Name :</span>
                    <input
                        type='text'
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        className='outline-blue-400 h-full text-lg placeholder:text-slate-400 px-2 py-2 rounded-md bg-white shadow-sm shadow-slate-200 w-3/5'
                        placeholder='Enter name here...'
                    ></input>
                </label>

                {/* Adde Member List */}
                <p className='self-start'>Members : </p>
                <div className='grid grid-cols-3 max-h-[88px] overflow-auto gap-1 w-full'>
                    {memberList.length === 0 && <p>No Members </p>}
                    {memberList.map(member=>
                        <div key={member.id} className='flex items-center gap-1 bg-blue-100 p-1 rounded-lg'>
                            <img src={member.profilePicture} className='size-8 rounded-full'/>
                            <span className='text-sm'>{member.name}</span>
                        </div>
                    )}
                </div>

                {/* searchUser bar */}
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
                    <RxCross2 className='text-slate-600 text-2xl justify-self-end cursor-pointer' onClick={() => setQuery("")}/>
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
                                {memberList.some(i=>i.id === member._id) ?
                                    <button className='bg-rose-500 text-white py-1 px-2 rounded-lg text-md cursor-pointer hover:bg-rose-600'
                                        onClick={() =>
                                            setMemberList(memberList.filter(i => i.id !== member._id))
                                        }>Remove</button>
                                    :
                                    <button className='bg-blue-500 text-white py-1 px-2 rounded-lg text-md cursor-pointer hover:bg-blue-600'
                                        onClick={() =>
                                            setMemberList([...memberList, {
                                                name: member.name,
                                                profilePicture: member.profilePicture,
                                                id: member._id
                                            }])
                                        }>
                                        Add Member
                                    </button>
                                }
                            </div>
                        }
                    }
                    )}
                </div>

                <div className='flex items-center gap-3 mt-2'>
                    <button className='bg-rose-400 py-1 px-3 rounded-md text-white hover:bg-rose-500 cursor-pointer' onClick={()=>setShowGroupBox(false)}>Cancel</button>
                    <button className='bg-blue-500 py-1 px-3 rounded-md text-white hover:bg-blue-600 cursor-pointer' onClick={()=>handleSubmit()}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default CreateGroupBox