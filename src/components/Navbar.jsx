import React from 'react'
import { IoChatbubbleEllipsesOutline, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { IoMdNotificationsOutline  } from "react-icons/io";


import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className='bg-[#6E00FF] text-white grid grid-rows-2 gap-2 p-2 pb-0 lg:flex lg:flex-col lg:items-center lg:rounded-xl lg:justify-between lg:py-2 lg:px-0'>
      <div className='flex items-center justify-between'>
        <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          className='w-10 rounded-full border-2 border-slate-600 lg:w-15'
        ></img>

        <div className='bg-white rounded-xl h-7/10 shadow-sm shadow-slate-100 flex items-center gap-2 px-2 lg:hidden'>
          <IoSearch className='text-slate-500 text-xl'/>
          <input type='search' placeholder='Search..' className='outline-none text-black flex items-center'></input>
        </div>

        <TbLogout className='text-3xl cursor-pointer lg:hidden'/>
      </div>

      <nav className='flex items-center justify-between gap-2 lg:flex-col lg:mb-10 w-full'>
        <Link to={'/chats'}
          className={`flex items-center justify-center text-xl h-full w-full ${isActive('/chats') ? 'border-b-2 border-white lg:border-r-4 lg:border-orange-400 lg:border-b-0 lg:bg-[#612DD1]':'lg:hover:bg-[#A48CD7]'} lg:transition-all lg:duration-100 lg:text-4xl lg:py-2`}
        >
          <IoChatbubbleEllipsesOutline className='max-lg:hidden' />
          <p className='lg:hidden'>Chats</p>
        </Link>

        <Link to={'/notifications'}
          className={`flex items-center justify-center text-xl h-full w-full ${isActive('/notifications') ? 'border-b-2 border-white lg:border-r-4 lg:border-orange-400 lg:border-b-0 lg:bg-[#612DD1]':'lg:hover:bg-[#A48CD7]'} lg:transition-all lg:duration-100 lg:text-4xl lg:py-2`}
        >
          <IoMdNotificationsOutline  className='max-lg:hidden' />
          <p className='lg:hidden'>Notifications</p>
        </Link>

        <Link to={'/settings'}
          className={`flex items-center justify-center text-xl h-full w-full ${isActive('/settings') ? 'border-b-2 border-white lg:border-r-4 lg:border-orange-400 lg:border-b-0 lg:bg-[#612DD1]':'lg:hover:bg-[#A48CD7]'} lg:transition-all lg:duration-100 lg:text-4xl lg:py-2`}
        >
          <IoSettingsOutline className='max-lg:hidden' />
          <p className='lg:hidden'>Settings</p>
        </Link>
      </nav>

      <div className='max-lg:hidden'>
      <TbLogout className='text-4xl cursor-pointer'/>
      </div>
    </div>
  )
}
