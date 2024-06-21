import { useEffect, useState } from 'react'
import Profile from './Profile'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
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
  const [checkStatus, setCheckStatus] = useState('none')
  const [lastEntry, setLastEntry] = useState('')
  const [countNewMessage, setCountNewMessage] = useState(0)
  function findObjByProperty(array, prop, propval) {
    return array.find(function (obj) {
      return obj[prop] === propval
    })
  }

  useEffect(
    () => {
      console.log('rerendering1')
      if (socket) {
        socket.on('online-status', (resp) => {
          console.log(resp)
          // if (resp.includes(username)) {
          //   setCheckStatus(true)
          // } else {
          //   setCheckStatus(false)
          // }
          // console.log(resp)
          let findVal = findObjByProperty(resp, 'data', username)
          console.log(findVal)
          if (findVal === undefined) {
            setLastEntry('--')
            setCheckStatus('offline')
          } else if (
            findVal &&
            findVal.data === username &&
            findVal.time === 'now'
          ) {
            setCheckStatus('online')
            setLastEntry('now')
          } else {
            setCheckStatus('offline')
            if (findVal && findVal.data === username) {
              setLastEntry()
              let dateToSubstract = new Date(findVal.time)
              let currDate = new Date()
              let substractedDate = currDate - dateToSubstract
              let difftimemin = substractedDate / 1000 / 60
              difftimemin = Math.floor(difftimemin)
              if (difftimemin > 59) {
                difftimemin /= 60
                difftimemin = Math.floor(difftimemin)
                if (difftimemin > 23) {
                  difftimemin /= 24
                  difftimemin = Math.floor(difftimemin)
                  setLastEntry(difftimemin + ' days ago')
                }
                setLastEntry(difftimemin + ' hr ago')
              } else {
                setLastEntry(difftimemin + ' min ago')
              }
              console.log(findVal.time)
            }
          }
        })
      }
    },
    // console.log(socket)

    [socket, username]
  )
  useEffect(() => {
    console.log('rerendering 2')
    // setLastEntry("--")
  }, [username])
  // useEffect(() => {
  //   if (socket)
  //     socket.on('receive-msg', (resp) => {
  //       console.log(resp)
  //     })
  // }, [socket, username])

  const [currInfo, setCurrInfo] = useState({})
  const [lastMsg, setLastMsg] = useState('')
  const setLastMsgFunc = (msg, usname) => {
    setLastMsg(msg)
    if (username !== usname) setCountNewMessage(countNewMessage + 1)
    console.log('setting last message')
  }
  async function getOneUser() {
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
  }
  useEffect(() => {
    getOneUser()
  }, [username])
  async function getLastChatFunc() {
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
  }
  useEffect(() => {
    getLastChatFunc()
  }, [username])
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
            backG={checkStatus === 'online' ? '#34D859' : '#a2a2a2'}
            bg={'#FAFAFA'}
            ht={'40px'}
            wt={'40px'}
            setLastMsgFunc={setLastMsgFunc}
          ></Profile>
          <div className='info'>
            <h5>{currInfo.fullName}</h5>
            <span>
              {checkStatus === 'none' ? <Skeleton /> : checkStatus}
              {/* {checkStatus === true ? 'Online' : 'Offline'} */}
            </span>
          </div>
          <div className='time'>
            <span>{lastEntry}</span>
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
