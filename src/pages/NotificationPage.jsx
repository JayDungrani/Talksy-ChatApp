import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications } from '../redux/friendSlice'
import Loading from '../components/Loading'

const NotificationPage = () => {

  const dispatch = useDispatch()

  const { loading, notificationList } = useSelector(state => state.friend)
  console.log(notificationList)

  const fetchNots = async () => {
    dispatch(fetchNotifications())
  }
  useEffect(() => {
    fetchNots()
  }, [])

  return (
    <div className='bg-slate-100 lg:bg-white flex flex-col items-center p-3'>
      <Loading showLoading={loading}/>
      <p className='text-xl font-semibold text-slate-600'>Friend Requests</p>
    </div>
  )
}

export default NotificationPage
