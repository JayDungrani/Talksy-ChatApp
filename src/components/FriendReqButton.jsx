import React, { useState } from 'react'
import { IoPersonAdd } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { sendFriendReq } from '../redux/friendSlice';
import { Snackbar } from '@mui/joy';
import socket from '../socket';

const FriendReqButton = ({ receiverId }) => {

    const dispatch = useDispatch();
    const {responseMessage} = useSelector(state=>state.friend)
    const [showMessage, setShowMessage] = useState(false)

    const handleReq = async () => {
        try {
            const data = await dispatch(sendFriendReq(receiverId)).unwrap()
            socket.emit("friendRequest", (data.friendRequest))
        } catch (error) {
            console.log(error.message)
        }
        setShowMessage(true)
    }

    return (

        <div onClick={handleReq} className='cursor-pointer p-2'>
            <Snackbar
                open={showMessage}
                anchorOrigin={{ 'vertical': 'top', 'horizontal': 'center' }}
                autoHideDuration={30000}
                color="primary"
                variant="soft"
                onClose={() => setShowMessage(false)}
            >{responseMessage}</Snackbar>
            <IoPersonAdd/>
        </div>
    )
}

export default FriendReqButton