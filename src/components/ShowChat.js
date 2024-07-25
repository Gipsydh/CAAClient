import ChatHeading from './ChatHeading'
import SendChat from './SendChat'
import ChatList from './ChatList'
import Popup from './Popup'
import { useEffect, useState, useMemo, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
const ShowChat = ({
  removeChatBar,
  setRemoveChatBar,
  username,
  currShowUserName,
  chatRoomKey,
  setRequestCall,
}) => {
  const [openChatFlag, setOpenChatFlag] = useState(false)
  useEffect(() => {
    setOpenChatFlag(removeChatBar)
  }, [removeChatBar])
  const [chatList, setChatList] = useState([])
  const [errorFiletype, setErrorFiletype] = useState(false)

  const [currUser, setCurrUser] = useState('')
  const [sortedRoomId, setSortedRoomId] = useState('')
  const [caretPosition, setCaretPosition] = useState(0)

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
        console.log(resp)
        for (let i = 0; i < resp.data.length; i++) {
          console.log(resp.data[i])
          const obj = {
            msg: resp.data[i].text,
            status: resp.data[i].receiver !== username ? 'receiver' : 'sender',
            chatRoomID: resp.data[i].currRoomID,
            username: username,
            time: resp.data[i].time,
            type: resp.data[i].type,
            content: resp.data[i].content,
          }
          setChatList((prevChatList) => [...prevChatList, obj])
        }
      })
  }
  useEffect(() => {
    setChatList([])
    setErrorFiletype(false)
  }, [username])
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })
    let roomID = ''
    axios
      .get(`${process.env.REACT_APP_LIVE_URL}/api/v1/chats`, {
        withCredentials: true,
      })
      .then((resp) => {
        roomID = resp.data.username
        setCurrUser(roomID)
        let tempRoomID = [roomID]
        //  if (roomID === 'subhnaskar11@gmail.com') {
        //    roomID += '|onibabahaha123456@gmail.com'
        //  } else {
        //    roomID += '|subhnaskar11@gmail.com'
        //  }
        tempRoomID.push(username)

        let res = tempRoomID.sort().join('|')

        // roomID += `|${username}`

        // const charArr = roomID.split('')
        // charArr.sort()
        // let res = charArr.join('')
        setSortedRoomId(res)
        // console.log(res)
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
  console.log(socket.on)
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
    console.log('received message')
    setChatList([...chatList, { ...msg, time: 'Today' }])
  })
  function isValidImageType(file) {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ]
    console.log(file.type)
    return validImageTypes.includes(file.type)
  }
  const [msg, setMsg] = useState('')
  const [file, setFile] = useState()
  const handleSubmit = (e) => {
    if (msg === '') return
    e.preventDefault()
    const formData = new FormData()

    // Append the file to the FormData object

    let obj = {}
    if (file) {
      formData.append('msg', file.name)
      formData.append('content', file)
      formData.append('status', 'sender')
      formData.append('username', username)
      formData.append('chatRoomID', currRoomID.current)
      formData.append('mimeType', file.type)
      formData.append('fileName', file.name)
      formData.append('type', 'image')
      obj = {
        msg: file.name,
        content: file,
        status: 'sender',
        username: username,
        chatRoomID: currRoomID.current,
        mimeType: file.type,
        fileName: file.name,
      }
    } else {
      obj = {
        msg: msg,
        status: 'sender',
        username: username,
        chatRoomID: currRoomID.current,
        type: 'normal_text',
      }
    }

    socket.emit('message', { obj, target: currRoomID.current })
    let fileReader = new FileReader()
    // fileReader.onload=func
    console.log(formData)
    if (file) {
      axios.post(`${process.env.REACT_APP_LIVE_URL}/api/v1/chats`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
    } else {
      axios.post(`${process.env.REACT_APP_LIVE_URL}/api/v1/chats`, obj, {
        withCredentials: true,
      })
    }
    setChatList([...chatList, { ...obj, time: 'today' }])
    console.log('current chat obj')
    // if (file) {
    //   obj = {
    //     msg: file.name,
    //     status: 'sender',
    //     username: username,
    //     chatRoomID: currRoomID.current,
    //     mimeType: file.type,
    //     fileName: file.name,

    //   }
    // }

    setMsg('')
    setFile()
  }
  socket.on('onDisconnect', () => {
    setCheckStaus(false)
  })
  const handleOnchange = (e) => {
    setMsg(e.target.value)
  }
  const handleCaretPosition = (e) => {
    setCaretPosition(e.target.selectionStart)
  }
  const caretRef = useRef(caretPosition)
  const msgRef = useRef(msg)
  useEffect(() => {
    caretRef.current = caretPosition
    msgRef.current = msg
  }, [caretPosition, msg])
  const handleEmoji = (data) => {
    {
      let lft = msgRef.current.substring(0, caretRef.current)
      let rht = msgRef.current.substring(caretRef.current)
      console.log(lft, rht)
      setMsg(lft + data.emoji + rht)
    }
  }
  const handleFileShare = (e) => {
    console.log('file triggered')
    if (e.target.files[0]) {
      if (
        e.target.files[0].size > Math.pow(2, 20) ||
        !isValidImageType(e.target.files[0])
      ) {
        console.log('greter size')
        setErrorFiletype(true)
        setMsg('')
        setFile()
        return
      } else {
        setMsg(e.target.files[0].name)
        setFile(e.target.files[0])
      }
    }
  }
  const closePopUp = () => {
    console.log('closepopup called')
    setErrorFiletype(false)
  }
  return (
    <>
      <ChatHeading
        removeChatBar={removeChatBar}
        setRemoveChatBar={setRemoveChatBar}
        checkStatus={checkStatus}
        username={currShowUserName}
        chatRoomID={sortedRoomId}
        setChatList={setChatList}
        socket={socket}
        openChatFlag={openChatFlag}
        setOpenChatFlag={setOpenChatFlag}
        handlePopup={closePopUp}
        setRequestCall={setRequestCall}
      ></ChatHeading>
      <ChatList
        chatRoomKey={chatRoomKey}
        username={currUser}
        list={chatList}
      ></ChatList>
      {errorFiletype && (
        <Popup
          handlePopup={closePopUp}
          width={30}
          left={80}
          bottom={80}
          message={`The file share feature currently supports only image files under 1MB. Future updates will expand file type support.`}
          type={'attension'}
        ></Popup>
      )}

      <SendChat
        func={handleSubmit}
        handleOnchange={handleOnchange}
        handleEmoji={handleEmoji}
        handleFileShare={handleFileShare}
        msg={msg}
        openChatFlag={openChatFlag}
        handleCaretPosition={handleCaretPosition}
      ></SendChat>
    </>
  )
}
export default ShowChat
