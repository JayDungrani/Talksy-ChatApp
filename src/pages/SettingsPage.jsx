import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { updateProfile } from '../redux/authSlice'
import Loading from '../components/Loading'

const SettingsPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [name, setName] = useState(user.name)
  const [status, setStatus] = useState(user.status)
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user.profilePicture);
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Preview selected image
    }
  };

  const handleUploadImage = async () => {
    setLoading(true)
    if (!selectedFile) return ;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("photoId", user._id)

    try {
      const { data } = await axios.post(`/api/user/picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials : true
      });
      return data;
    } catch (error) {
      console.error("Error uploading image", error);
  };
}

const handleUpdate = async()=>{
  try {
    const profileUrl = await handleUploadImage()
    await dispatch(updateProfile(
      {
        name : name,
        profilePicture : profileUrl,
        status : status
      }
    )).unwrap()
    setLoading(false)
  } catch (error) {
    console.log(error.message)
  }
}

  return (
    <div className='bg-slate-100 lg:bg-white flex flex-col items-center max-lg:pt-10 lg:justify-center lg:rounded-2xl'>
      <Loading showLoading={loading}/>
      <div className='flex flex-col gap-2 p-5 lg:shadow-lg lg:shadow-slate-300 lg:rounded-2xl lg:p-8'>

        <div className='flex flex-col items-center gap-2 mb-2'>
          <img src={preview} className='size-20 rounded-full border-2 border-blue-800' />
          <label className="rounded-sm text-white cursor-pointer px-3 py-1 bg-blue-500">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange}/>
            <span>Edit Picture</span>
          </label>
        </div>

        <div className='flex flex-col'>
          <span className='text-slate-500 text-xl font-semibold'>Username :</span>
          <label className='w-fit flex items-center gap-2 border-2 border-slate-300 px-2 py-2 rounded-sm focus-within:border-[#009DFF]'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='outline-none h-full text-lg placeholder:text-slate-400'
            ></input>
          </label>
        </div>

        <div className='flex flex-col'>
          <span className='text-slate-500 text-xl font-semibold'>Status :</span>
          <label className='w-fit flex items-center gap-2 border-2 border-slate-300 px-2 py-2 rounded-sm focus-within:border-[#009DFF]'>
            <input
              type='text'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='outline-none h-full text-lg placeholder:text-slate-400'
            ></input>
          </label>
        </div>

        <div className='flex items-center gap-3 mt-5'>
          <button className='border-2 w-20 border-blue-600 px-3 py-1 rounded-sm cursor-pointer'>Cancel</button>
          <button className='border-2 w-20 border-blue-600 bg-blue-600 text-white px-3 py-1 rounded-sm cursor-pointer' onClick={handleUpdate}>Save</button>
        </div>

      </div>
    </div>
  )
}

export default SettingsPage