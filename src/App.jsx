import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import SettingsPage from './pages/SettingsPage'
import ChatPage from './pages/ChatPage'
import NotificationPage from './pages/NotificationPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AuthPage from './pages/AuthPage'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectRoute'
import { useEffect, useState } from 'react'
import { addReqest, fetchNotifications } from './redux/friendSlice'
import socket from './socket'
import { clearOpenedChat } from './redux/chatSlice'
import axios from 'axios'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isServerOnline, setIsServerOnline] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`/api/user/health`); // Replace with your server health endpoint
        if (response.status === 200) {
          setIsServerOnline(true);
          clearInterval(interval); 
        } else {
          setIsServerOnline(false);
        }
      } catch (error) {
        console.log(`/api/user/health`)
        console.log(error)
        setIsServerOnline(false);
      }
    };
    checkServerStatus(); // Check on mount
    // Poll every 5 seconds
    const interval = setInterval(checkServerStatus, 5000);
    if(!user) return ;
    dispatch(fetchNotifications());

    const handleNotification = (notification) => {
      dispatch(addReqest(notification));
    };
    socket.on('newFriendRequest', handleNotification)

    const handleBeforeUnload = () => {
      socket.emit("userDisconneted", (user._id)); // Send user ID before closing
      dispatch(clearOpenedChat())
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    
    return () => {
      clearInterval(interval); // Cleanup on unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off('newFriendRequest', handleNotification)
    };

  }, [])

  if (!isServerOnline) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Waiting for Server...</h1>
        <p className="text-gray-600 mt-2">Please wait while we try to reconnect.</p>
      </div>
    );
  }

  return (
    <div className='h-screen w-screen
                    grid lg:grid-cols-[1fr_13fr] lg:gap-5 lg:grid-rows-none lg:p-5 
                    grid-rows-[1fr_9fr] grid-cols-none gap-0 bg-[#EFF6FC]'
    >
      {user && <Navbar user={user} />}
      <Routes>
        <Route
          path='/'
          element={<AuthPage />}
        />

        <Route
          path='/chats'
          element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
        />

        <Route
          path='/notifications'
          element={<ProtectedRoute><NotificationPage /></ProtectedRoute>}
        />

        <Route
          path='/settings'
          element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
        />

        <Route
          path='/login'
          element={<LoginPage />}
        />

        <Route
          path='/signup'
          element={<SignUpPage />}
        />

      </Routes>
    </div>
  )
}

export default App
