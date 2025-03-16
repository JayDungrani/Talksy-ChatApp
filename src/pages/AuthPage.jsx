import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUser } from '../redux/authSlice'

const AuthPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isAuthenticated } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                await dispatch(fetchUser()).unwrap();
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUserData();
    }, [dispatch]); 

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            navigate("/chats");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <p className='text-5xl'>Welcome to talksy</p>
        </div>
    )
}

export default AuthPage