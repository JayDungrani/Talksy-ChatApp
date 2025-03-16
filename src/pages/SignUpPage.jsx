import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser, signupUser } from '../redux/authSlice';
import Snackbar from '@mui/joy/Snackbar';
import { IoMailOutline } from "react-icons/io5";
import { RiKey2Line } from "react-icons/ri";
import Loading from '../components/Loading';
import { FaRegUserCircle } from "react-icons/fa";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userData = { name, email, password }

  const [showSnake, setShowSnake] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

   const handleSubmit = async (e) => {
     try {
       userData.name = capitalizeFirstLetter(name);
       e.preventDefault();
       const resultAction = await dispatch(signupUser(userData)).unwrap();
 
       if (resultAction) {
         await dispatch(fetchUser()).unwrap()
         navigate("/chats"); // Redirect on successful login
       }
     } catch (error) {
       setShowSnake(true)
     }
   };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [])

  return (
    <div className='w-full h-full absolute top-0 left-0 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-200 to-sky-500'>
      {error && <Snackbar
        open={showSnake}
        anchorOrigin={{ 'vertical': 'top', 'horizontal': 'center' }}
        autoHideDuration={3000}
        color="danger"
        variant="soft"
        onClose={() => setShowSnake(false)}
      >{error.message}</Snackbar>}
      <div>
        <Loading showLoading={loading} />
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-8 p-7 shadow-lg shadow-slate-800 bg-white rounded-xl'>

        <p className='text-3xl font-semibold'>Sign Up</p>

        <div className='flex flex-col items-center gap-2'>

          <label className='w-full flex items-center gap-2 border-2 border-slate-300 px-2 py-2 rounded-lg focus-within:border-[#009DFF]'>
            <FaRegUserCircle className='text-2xl text-slate-600' />
            <input
              type='text'
              placeholder='Your name'
              className='outline-none h-full text-lg font-semibold placeholder:text-slate-400'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            ></input>
          </label>

          <label className='w-full flex items-center gap-2 border-2 border-slate-300 px-2 py-2 rounded-lg focus-within:border-[#009DFF]'>
            <IoMailOutline className='text-2xl text-slate-600' />
            <input
              type='email'
              placeholder='Your email'
              className='outline-none h-full text-lg font-semibold placeholder:text-slate-400'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </label>

          <label className='w-full flex items-center gap-2 border-2 border-slate-300 px-2 py-2 rounded-lg focus-within:border-[#009DFF]'>
            <RiKey2Line className='text-2xl text-slate-600' />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Your password'
              className='outline-none h-full text-lg font-semibold placeholder:text-slate-400'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            ></input>
          </label>

          <label className='self-start flex gap-3 pl-2 cursor-pointer select-none'>
            <input type="checkbox" onClick={() => setShowPassword(!showPassword)} className='w-4' />
            Show password
          </label>
        </div>
        <button type='submit' className='bg-[#009DFF] py-2 text-white rounded-lg font-semibold cursor-pointer'>Sign Up</button>
        <p className='text-center text-slate-500'>Already have an account? <Link to='/login' className='text-[#007ac6]'>Login</Link></p>
      </form>
    </div>
  )
}

export default SignUpPage