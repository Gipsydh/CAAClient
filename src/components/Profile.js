import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
const Profile = ({
  socket,
  sender,
  receiver,
  pic,
  backG,
  bg,
  ht,
  wt,
  setLastMsgFunc,
}) => {
  // const socket = useMemo(() => {
  //   return io(process.env.REACT_APP_LIVE_URL, {
  //     withCredentials: true,
  //   })
  // }, [])
  const [currChatRoomID, setCurrChatRoomID] = useState('')
  let res
  function getRoomIDKEY() {
    let roomID = sender
    let tempRoomID = [roomID]
    tempRoomID.push(receiver)
    res = tempRoomID.sort().join('|')
  }

  useEffect(() => {
    if (socket) {
      getRoomIDKEY()
      setCurrChatRoomID(res)
      socket.emit('enter', { res: res })
    }
  }, [receiver])
  useEffect(() => {}, [socket])
  if (socket) {
    socket.on('receive-msg', (resp) => {
      if (currChatRoomID === resp.chatRoomID) {
        setLastMsgFunc(resp.msg, resp.username)
      }
    })
  }
  return (
    <>
      <div
        className='profile button'
        style={{
          height: ht,
          width: wt,
          backgroundImage: `url(${pic})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
        onClick={() => {
          console.log(pic)
        }}
      >
        <div
          className='status onlineProfile'
          style={{
            borderColor: bg,
            backgroundColor: backG,
          }}
        ></div>
        <div className='img' style={{}}></div>
      </div>
    </>
  )
}

export default Profile
