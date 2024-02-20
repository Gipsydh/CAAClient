import { useEffect, useState } from 'react'
import Profile from './Profile'
import axios from 'axios'

const Friends = ({ username, selectFromFriends }) => {
  const [currInfo, setCurrInfo] = useState({})
  useEffect(async () => {
    await axios
      .post(
        'http://localhost:3001/api/v1/chats/getOneUser',
        {
          username: username,
        },
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        setCurrInfo(resp.data[0])
      })
  }, [])
  return (
    <>
      <div className='friends' onClick={()=>{
        selectFromFriends(username)
      }}>
        <div className='upper'>
          <Profile
            pic={currInfo.picture}
            bg={'#FAFAFA'}
            ht={'40px'}
            wt={'40px'}
          ></Profile>
          <div className='info'>
            <h5>{currInfo.fullName}</h5>
            <span>Online</span>
          </div>
          <div className='time'>
            <span>3h ago</span>
          </div>
        </div>
        <div className='lower'>
          <div className='msg'>
            <span>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Quibusdam, veritatis?
            </span>
          </div>
          <div className='count'>
            <span>4</span>
          </div>
        </div>
      </div>
    </>
  )
}
export default Friends
