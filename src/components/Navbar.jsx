import React from 'react'
import { IoChatbubbleEllipsesOutline, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { Tooltip } from '@mui/joy';
import SearchBar from './SearchBar';

export const Navbar = ({ user }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/")
    } catch (error) {
      console.error("Failed to logout User :", error);
    }
  }

  return (
    <div className='bg-[#009DFF] text-white grid grid-rows-2 p-2 pb-0 lg:flex lg:flex-col lg:items-center lg:rounded-2xl lg:justify-between lg:py-5 lg:px-0'>

      <div className='flex items-center justify-between'>
        <Tooltip title={user.name} color='primary' placement='bottom' variant='solid'>
          <img src={user.profilePicture}
            className='w-12 rounded-full border-2 border-[#006CD0] lg:w-15'
          ></img>
        </Tooltip>

        {/* <div className='bg-white rounded-xl h-7/10 shadow-sm shadow-slate-100 flex items-center gap-2 px-2 lg:hidden'>
          <IoSearch className='text-slate-500 text-xl' />
          <input type='search' placeholder='Search..' className='outline-none text-black flex items-center'></input>
        </div> */}
        <div className='bg-white h-7/10 rounded-3xl flex items-center gap-2 px-2 lg:hidden'>
          <SearchBar />
        </div>
        <TbLogout className='text-3xl cursor-pointer lg:hidden' onClick={handleLogout} />
      </div>

      <nav className='flex items-center justify-between gap-2 lg:flex-col lg:mb-10 w-full'>
        <Link to={'/chats'}
          className={`flex items-center justify-center text-xl h-full w-full ${isActive('/chats') ? 'border-b-2 border-white lg:border-r-4 lg:border-orange-400 lg:border-b-0 lg:bg-[#006CD0]' : 'lg:hover:bg-[#0077E7]'} lg:transition-all lg:duration-100 lg:text-4xl lg:py-2`}
        >
          <IoChatbubbleEllipsesOutline className='max-lg:hidden' />
          <p className='lg:hidden'>Chats</p>
        </Link>

        <Link to={'/notifications'}
          className={`flex items-center justify-center text-xl h-full w-full ${isActive('/notifications') ? 'border-b-2 border-white lg:border-r-4 lg:border-orange-400 lg:border-b-0 lg:bg-[#006CD0]' : 'lg:hover:bg-[#0077E7]'} lg:transition-all lg:duration-100 lg:text-4xl lg:py-2`}
        >
          <IoMdNotificationsOutline className='max-lg:hidden' />
          <p className='lg:hidden'>Notifications</p>
        </Link>

        <Link to={'/settings'}
          className={`flex items-center justify-center text-xl h-full w-full ${isActive('/settings') ? 'border-b-2 border-white lg:border-r-4 lg:border-orange-400 lg:border-b-0 lg:bg-[#006CD0]' : 'lg:hover:bg-[#0077E7]'} lg:transition-all lg:duration-100 lg:text-4xl lg:py-2`}
        >
          <IoSettingsOutline className='max-lg:hidden' />
          <p className='lg:hidden'>Settings</p>
        </Link>
      </nav>

      <div className='max-lg:hidden cursor-pointer' onClick={handleLogout}>
        <Tooltip title='Logout' color='neutral' placement='top' variant='solid'>
          <TbLogout className='text-4xl' />
        </Tooltip>
      </div>
    </div>
  )
}
