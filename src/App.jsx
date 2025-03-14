import {Routes, Route} from 'react-router-dom'
import { Navbar } from './components/Navbar'
import ChatPage from './pages/chatPage'
import SettingsPage from './pages/SettingsPage'
import NotificationPage from './pages/NotificationPage'

function App() {
  return (
    <div className='h-screen w-screen
                    grid lg:grid-cols-[1fr_13fr] lg:gap-5 lg:grid-rows-none lg:p-5 
                    grid-rows-[1fr_9fr] grid-cols-none gap-0'>
      <Navbar/>
        <Routes>
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/settings" element={<SettingsPage />} />

        </Routes>
    </div>
  )
}

export default App
