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
  console.log(sender + receiver)
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
      console.log(res)
      setCurrChatRoomID(res)
      console.log('entering')
      socket.emit('enter', { res: res })
      console.log(currChatRoomID)
    }
  }, [receiver])
  useEffect(() => {
    console.log('receiving')
    
  }, [socket])
  if (socket) {
    socket.on('receive-msg', (resp) => {
      console.log(currChatRoomID)
      console.log(resp.chatRoomID)

      if (currChatRoomID === resp.chatRoomID) {
        console.log('hitting')

        setLastMsgFunc(resp.msg)
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
