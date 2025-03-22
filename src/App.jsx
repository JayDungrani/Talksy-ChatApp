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
import { useEffect } from 'react'
import { fetchNotifications } from './redux/friendSlice'
import socket from './socket'
import { clearOpenedChat } from './redux/chatSlice'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  useEffect(() => {
    if (!user?._id) return;

    dispatch(fetchNotifications());
    const handleBeforeUnload = () => {
      socket.emit("userDisconneted",(user._id)); // Send user ID before closing
      dispatch(clearOpenedChat())
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, [dispatch])
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
