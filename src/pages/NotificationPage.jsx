import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acceptFriendReq, fetchNotifications, rejectFriendReq } from '../redux/friendSlice'
import Loading from '../components/Loading'
import SingleRequest from '../components/SingleRequest'

const NotificationPage = () => {

  const dispatch = useDispatch()

  const { loading, notificationList } = useSelector(state => state.friend)
  const fetchNots = async () => {
    await dispatch(fetchNotifications()).unwrap()
  }
  useEffect(() => {
    fetchNots()
  }, [])

  const accpetReq = async (id) => {
    await dispatch(acceptFriendReq(id)).unwrap()
    await fetchNots()
  }
  const rejectReq = async (id) => {
    await dispatch(rejectFriendReq(id)).unwrap()
    await fetchNots()
  }

  return (
    <div className='bg-slate-100 lg:bg-white flex flex-col items-center gap-3 p-3 w-full lg:rounded-2xl lg:px-10'>
      <Loading showLoading={loading} />
      {notificationList && (notificationList.length === 0 ?
        <p className='text-xl flex items-center justify-center font-semibold text-slate-600'>No Friend Requests Yet!</p>
        :
        <p className='text-xl font-semibold text-slate-600'>Friend Requests</p>
      )}
      <div className='w-full'>
        {notificationList && notificationList.map(notif =>
          <SingleRequest
            name={notif.sender.name}
            profilePicture={notif.sender.profilePicture}
            acceptReq={accpetReq}
            rejectReq={rejectReq}
            notifId={notif._id}
            status={notif.status}
            key={notif._id}
          />
        )}
      </div>
    </div>
  )
}

export default NotificationPage
