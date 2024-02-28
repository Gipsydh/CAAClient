import { useEffect, useState } from 'react'
import Profile from './Profile'
import axios from 'axios'
const ShowUsers = ({ user }) => {
  const [isFriend, setIsFriend] = useState(false)
  // console.log(user)
  const sendRequest=async()=>{
   await axios
     .post(
       `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/sendReq`,
       {
         username: user.email,
       },
       {
         withCredentials: true,
       }
     )
     .then((resp) => {})
  }
  const getUsers=async () => {
    {
      await axios
        .post(
          `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/isFriend`,
          { username: user.email },
          { withCredentials: true }
        )
        .then((resp) => {
          setIsFriend(resp.data.friend)
        })
    }
  }
  useEffect(() => {
    getUsers()
  }, [])
  return (
    <>
      <div
        className='friends'
        style={{
          padding: '25px 25px 50px 25px',
        }}
      >
        <div className='upper'>
          <Profile
            pic={user.picture}
            bg={'#FAFAFA'}
            ht={'40px'}
            wt={'40px'}
          ></Profile>
          <div className='info'>
            <h5>{user.fullName}</h5>
            <div
              className='msg'
              style={{
                width: '180px',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              <span>{user.email}</span>
            </div>
          </div>
          <div className='time'>{/* <span>3h ago</span> */}</div>
        </div>
        <div className='addToFriend'>
          {isFriend === true ? (
            <>
              <span>already your friend</span>
              <i className='fa-solid fa-check'></i>
            </>
          ) : (
            <><div onClick={sendRequest}>

              <span>Add to Friend</span>
              <i className='fa-solid fa-user-plus'></i>
            </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default ShowUsers
