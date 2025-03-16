import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import ChatPage from './pages/chatPage'
import SettingsPage from './pages/SettingsPage'
import NotificationPage from './pages/NotificationPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AuthPage from './pages/AuthPage'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectRoute'

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";
  const { user, isAuthenticated } = useSelector((state) => state.auth)

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
