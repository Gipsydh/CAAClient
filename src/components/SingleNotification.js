import axios from 'axios'
import Profile from './Profile'
import { useEffect, useState } from 'react'
const SingleNotification = (user) => {
  const [currUser, setCurruser] = useState({})
  const [showNotification, setShowNotification] = useState('Accept')
  const [decline, setDecline] = useState(false)
  const [flag,setFlag]=useState(false)
  const handleAcceptBtn = async () => {
    await axios
      .post(
        'http://localhost:3001/api/v1/chats/acceptFrndReq',
        {
          username: currUser.email,
        },
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        if (resp.status === 200) {
          setShowNotification('accepted')
        }
      })
  }
  const handleReject = async () => {
    await axios
      .post(
        'http://localhost:3001/api/v1/chats/rejectFrndReq',
        {
          username: currUser.email,
        },
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        if (resp.status === 200) {
          setFlag(true)
          setTimeout(() => {
            
            setDecline(true)
          }, 300);
        }
      })
  }
  const handleUser = async () => {
    await axios
      .post(
        'http://localhost:3001/api/v1/chats/getOneUser',
        {
          username: user.user.from,
        },
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        setCurruser(resp.data[0])
      })
  }
  useEffect(() => {
    handleUser()
  }, [])
  return (
    <>
      { (
        <div
          className={
            flag ? 'singleNotification fadeUp' : 'singleNotification'
          }
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <Profile pic={currUser.picture}></Profile>
            <div className='info'>
              <h5>{currUser.fullName}</h5>
              <span>{currUser.email}</span>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div className='acceptBtn button' onClick={handleAcceptBtn}>
              <span>{showNotification}</span>
            </div>

            <div className='reject button' onClick={handleReject}>
              <i className='fa-solid fa-xmark'></i>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default SingleNotification
