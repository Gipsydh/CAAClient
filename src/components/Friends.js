import { useEffect, useState } from 'react'
import Profile from './Profile'
import axios from 'axios'

const Friends = ({
  username,

  identifier,
  currIden,
  setIdentifier,
  selectFromFriends,
  getFromDetails,
}) => {
  const [currInfo, setCurrInfo] = useState({})
  useEffect(async () => {
    await axios
      .post(
        `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/getOneUser`,
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
      <div
        className={identifier === currIden ? `friends effect` : `friends`}
        onClick={() => {
          selectFromFriends(username)
          getFromDetails(currInfo.fullName,currInfo.picture)
          setIdentifier(currIden)
        }}
      >
        <div
          className='effectGlow'
          style={{
            display: identifier === currIden ? `block` : `none`,
          }}
        ></div>
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
