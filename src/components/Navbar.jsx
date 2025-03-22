import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipsesOutline, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { Tooltip } from '@mui/joy';
import SearchBar from './SearchBar';
import socket from '../socket';

export const Navbar = ({ user }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { notificationList } = useSelector(state => state.friend)
  const handleLogout = async () => {
    try {
      socket.emit("userDisconneted",(user._id));
      await dispatch(logoutUser()).unwrap();
      localStorage.clear()
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
            className='size-12 rounded-full border-2 border-[#006CD0] lg:size-15'
          ></img>
        </Tooltip>

        <div className='bg-white h-7/10 rounded-3xl flex items-center gap-2 px-2 lg:hidden justify-between'>
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
          className={`flex items-center justify-center text-xl h-full w-full ${isActive('/notifications') ? 'border-b-2 border-white lg:border-r-4 lg:border-orange-400 lg:border-b-0 lg:bg-[#006CD0]' : 'lg:hover:bg-[#0077E7]'} lg:transition-all lg:duration-100 lg:text-4xl lg:py-2 relative`}
        >
          {notificationList.filter(n => n.status === "pending").length !== 0 &&
            <span className='absolute max-lg:top-0 max-lg:left-0 lg:top-0 lg:right-3 text-sm bg-red-500 size-5 text-center rounded-full'>{notificationList.filter(n => n.status === "pending").length}</span>
          }
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
