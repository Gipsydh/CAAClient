import ChatHeading from './ChatHeading'
import SendChat from './SendChat'
import ChatList from './ChatList'
import { useEffect, useState, useMemo, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
const ShowChat = ({
  removeChatBar,
  setRemoveChatBar,
  username,
  currShowUserName,
}) => {
  const [chatList, setChatList] = useState([])
  const [currUser, setCurrUser] = useState('')
  const [sortedRoomId, setSortedRoomId] = useState('')
  const [notificationPerm, setNotificationPerm] = useState(
    Notification.permission
  )
  const [checkStatus, setCheckStaus] = useState(false)
  const currRoomID = useRef(null)
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_LIVE_URL, {
      withCredentials: true,
    })
  }, [])
  const getChatsFromDB = async () => {
    console.log('userToken:' + currRoomID.current)
    await axios
      .post(
        `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/getChats`,
        {
          currRoomID: currRoomID.current,
        },
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        for (let i = 0; i < resp.data.length; i++) {
          const obj = {
            msg: resp.data[i].text,
            status: resp.data[i].receiver !== username ? 'receiver' : 'sender',
            chatRoomID: resp.data[i].currRoomID,
            username: username,
            time: resp.data[i].time,
          }
          setChatList((prevChatList) => [...prevChatList, obj])
        }
      })
  }
  useEffect(() => {
    setChatList([])
  }, [username])
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })
    let roomID = ''
    axios
      .get( `${process.env.REACT_APP_LIVE_URL}/api/v1/chats`, { withCredentials: true })
      .then((resp) => {
        roomID = resp.data.username
        setCurrUser(roomID)
        //  if (roomID === 'subhnaskar11@gmail.com') {
        //    roomID += '|onibabahaha123456@gmail.com'
        //  } else {
        //    roomID += '|subhnaskar11@gmail.com'
        //  }
        roomID += `|${username}`
        const charArr = roomID.split('')
        charArr.sort()
        let res = charArr.join('')
        // setSortedRoomId(res)
        console.log(res)
        currRoomID.current = res
        socket.emit('enter', { res: res, username: resp.data.username })
      })
      .then(() => {
        getChatsFromDB()
      })

    socket.on('check-status', (m) => {
      setCheckStaus(true)
    })
  }, [username])
  socket.on('receive-msg', (msg) => {
    // if (notificationPerm==='granted') {
    //   new Notification('ChatNest ',{
    //     body:"this is a notification"
    //   })
    // }
    // else if(notificationPerm!=='denied'){
    //   Notification.requestPermission().then(permission=>{
    //     setNotificationPerm(permission)
    //     if(permission==='granted'){
    //       new Notification('ChatNest ', {
    //         body: 'this is a notification',
    //       })
    //     }
    //   })
    // }
    setChatList([...chatList, { ...msg, time: 'Today' }])
  })

  const [msg, setMsg] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()

    const obj = {
      msg: msg,
      status: 'sender',
      username: username,
      chatRoomID: currRoomID.current,
    }
    axios.post(
      `${process.env.REACT_APP_LIVE_URL}/api/v1/chats`,
      obj,
      {
        withCredentials: true,
      }
    )
    socket.emit('message', { obj, target: currRoomID.current })
    console.log('current chat obj')
    console.log(obj)
    setChatList((prevChatList) => [...chatList, { ...obj, time: 'today' }])
    setMsg('')
  }
  socket.on('onDisconnect', () => {
    setCheckStaus(false)
  })
  const handleOnchange = (e) => {
    setMsg(e.target.value)
  }
  return (
    <>
      <ChatHeading
        removeChatBar={removeChatBar}
        setRemoveChatBar={setRemoveChatBar}
        checkStatus={checkStatus}
        username={currShowUserName}
      ></ChatHeading>
      <ChatList username={currUser} list={chatList}></ChatList>
      <SendChat
        func={handleSubmit}
        handleOnchange={handleOnchange}
        msg={msg}
      ></SendChat>
    </>
  )
}
export default ShowChat
