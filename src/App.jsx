import {Routes, Route, useLocation} from 'react-router-dom'
import { Navbar } from './components/Navbar'
import ChatPage from './pages/chatPage'
import SettingsPage from './pages/SettingsPage'
import NotificationPage from './pages/NotificationPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className='h-screen w-screen
                    grid lg:grid-cols-[1fr_13fr] lg:gap-5 lg:grid-rows-none lg:p-5 
                    grid-rows-[1fr_9fr] grid-cols-none gap-0'
    >
      {!hideNavbar && <Navbar/>}
        <Routes>
          <Route path='/chats' element={<ChatPage />} />
          <Route path='/notifications' element={<NotificationPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignUpPage/>}/>
        </Routes>
    </div>
  )
}

export default App
