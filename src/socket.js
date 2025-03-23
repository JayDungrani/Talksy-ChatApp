import {io} from 'socket.io-client'

const socket = io(import.meta.env.VITE_API_BASE_URL)
// const socket = io("http://192.168.1.4:3000")

export default socket