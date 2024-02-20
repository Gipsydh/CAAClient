import ChatHeading from './ChatHeading'
import SendChat from './SendChat'
import ChatList from './ChatList'
import { useEffect, useState, useMemo, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
const ShowChat = ({ username }) => {
  const [chatList, setChatList] = useState([])
  const [sortedRoomId, setSortedRoomId] = useState('')
  const [checkStatus, setCheckStaus] = useState(false)
  const currRoomID = useRef(null)
  const socket = useMemo(() => {
    return io('http://localhost:3001', {
      withCredentials: true,
    })
  }, [])
  const getChatsFromDB = async () => {
    console.log('userToken:' + currRoomID.current)
    await axios
      .post('http://localhost:3001/api/v1/chats/getChats', {
        currRoomID: currRoomID.current,
      })
      .then((resp) => {
        for (let i = 0; i < resp.data.length; i++) {
          const obj = {
            msg: resp.data[i].text,
            status: resp.data[i].receiver === username ? 'receiver' : 'sender',
            chatRoomID: resp.data[i].currRoomID,
            username: username,
          }
          setChatList((prevChatList)=>[...prevChatList, obj])
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
      .get('http://localhost:3001/api/v1/chats', { withCredentials: true })
      .then((resp) => {
        roomID = resp.data.username
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
    setChatList([...chatList, msg])
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
    axios.post('http://localhost:3001/api/v1/chats', obj, {
      withCredentials: true,
    })
    socket.emit('message', { obj, target: currRoomID.current })
    console.log('current chat obj')
    console.log(obj)
    setChatList((prevChatList) => [...chatList, obj])
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
      <ChatHeading checkStatus={checkStatus}></ChatHeading>
      <ChatList list={chatList}></ChatList>
      <SendChat
        func={handleSubmit}
        handleOnchange={handleOnchange}
        msg={msg}
      ></SendChat>
    </>
  )
}
export default ShowChat
