import { useEffect, useState } from 'react'
import Profile from './Profile'
import axios from 'axios'

const Friends = ({
  currUserLogin,
  socket,
  io,
  username,

  identifier,
  currIden,
  setIdentifier,
  selectFromFriends,
  getFromDetails,
}) => {
  const [checkStatus, setCheckStatus] = useState(false)
  const [countNewMessage, setCountNewMessage] = useState(0)

  useEffect(
    () => {
      if (socket) {
        socket.on('online-status', (resp) => {
          if (resp.includes(username)) {
            setCheckStatus(true)
          } else {
            setCheckStatus(false)
          }
        })
      }
    },
    // console.log(socket)
    [socket]
  )
  useEffect(() => {
    if (socket)
      socket.on('receive-msg', (resp) => {
        console.log(resp)
      })
  }, [socket])

  const [currInfo, setCurrInfo] = useState({})
  const [lastMsg, setLastMsg] = useState('')
  const setLastMsgFunc = (msg) => {
    setLastMsg(msg)
    setCountNewMessage(countNewMessage + 1)
    console.log('setting last message')
  }
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
  useEffect(async () => {
    await axios
      .post(
        `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/getLastChat`,
        {
          username: username,
        },
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        console.log(resp)
        console.log('last message is')
        console.log(resp.data)
        setLastMsg(resp.data.text)
      })
  }, [])
  return (
    <>
      <div
        className={identifier === currIden ? `friends effect` : `friends`}
        onClick={() => {
          setCountNewMessage(0)
          selectFromFriends(username)
          getFromDetails(currInfo.fullName, currInfo.picture, currInfo.email)
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
            socket={socket}
            sender={currUserLogin}
            receiver={currInfo.email}
            pic={currInfo.picture}
            backG={checkStatus === true ? '#34D859' : '#a2a2a2'}
            bg={'#FAFAFA'}
            ht={'40px'}
            wt={'40px'}
            setLastMsgFunc={setLastMsgFunc}
          ></Profile>
          <div className='info'>
            <h5>{currInfo.fullName}</h5>
            <span>{checkStatus === true ? 'Online' : 'Offline'}</span>
          </div>
          <div className='time'>
            <span>3h ago</span>
          </div>
        </div>
        <div className='lower'>
          <div className='msg'>
            <span>
              {lastMsg === undefined || lastMsg === ''
                ? 'No messages :)'
                : lastMsg}
            </span>
          </div>

          {countNewMessage > 0 && (
            <div className='count'>
              <span>{countNewMessage}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default Friends
