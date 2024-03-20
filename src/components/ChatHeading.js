import { useState, useEffect } from 'react'
import { ChatOption } from './ChatOption'
import Profile from './Profile'
import axios from 'axios'
const ChatHeading = ({
  removeChatBar,
  setRemoveChatBar,
  username,
  chatRoomID,
  setChatList,
  socket,
}) => {
  const [checkStatus, setCheckStatus] = useState(false)
  useEffect(
    () => {
      if (socket)
        socket.on('online-status', (resp) => {
          if (resp.includes(username.email)) {
            setCheckStatus(true)
          } else {
            setCheckStatus(false)
          }
        })
    },
    // console.log(socket)
    [socket]
  )
  const [openOptions, setOpenOptions] = useState(false)
  const handleChatDelete = async () => {
    try {
      if (window.confirm('Are you sure to delete your chats?')) {
        await axios
          .post(
            `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/userChatDelete`,
            {
              username: username,
              chatRoomID: chatRoomID,
            },
            {
              withCredentials: true,
            }
          )
          .then((resp) => {
            setOpenOptions(false)
            setChatList([])
          })
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <header className='chatHeading'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className='backBtn button'
            onClick={() => {
              setRemoveChatBar(!removeChatBar)
            }}
          >
            <i class='fa-solid fa-angle-left'></i>
          </div>
          <div className='userInfo'>
            <Profile
              pic={username.picture}
              backG={checkStatus === true ? '#34D859' : '#a2a2a2'}
              bg={'white'}
              ht={'40px'}
              wt={'40px'}
            ></Profile>
          </div>
          <div className='info' style={{ marginLeft: '20px' }}>
            <h5>{username.username}</h5>
            <div className='statusUser'>
              <span>{checkStatus === true ? 'Online' : 'Offline'}</span>
              <span> . </span>
              <span>Last seen 3 hours ago</span>
            </div>
          </div>
        </div>
        <div className='options'>
          <div className='button btn2'>
            <i class='fa-solid fa-phone'></i>
          </div>
          <div className='button btn2'>
            <i class='fa-solid fa-video'></i>
          </div>
          <div
            className='button btn2'
            onClick={(e) => {
              if (openOptions === true) {
                document
                  .querySelector('.showOptions')
                  .classList.add('showOptionsMotionRem')
                setTimeout(() => {
                  setOpenOptions(!openOptions)
                }, 100)
              } else {
                setOpenOptions(!openOptions)
              }
            }}
          >
            <i class='fa-solid fa-ellipsis'></i>
          </div>
        </div>
        {openOptions && (
          <div
            className={
              openOptions
                ? 'showOptions showOptionsMotion'
                : 'showOptions showOptionsMotionRem'
            }
          >
            <ChatOption
              category={'danger'}
              data={'Delete all chats'}
              func={handleChatDelete}
            ></ChatOption>
          </div>
        )}
      </header>
    </>
  )
}
export default ChatHeading
