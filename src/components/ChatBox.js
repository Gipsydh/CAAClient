import Profile from './Profile'
import SideOptions from './SideOptions'
import Settings from './Settings'
import Search from './Search'
import Friends from './Friends'
import ChatHeading from './ChatHeading'
import ShowChat from './ShowChat'
import VideoChat from './VideoChat'
import { useEffect, useState, useMemo, useRef } from 'react'
import axios, { isCancel } from 'axios'
import { io } from 'socket.io-client'
import Skeleton from 'react-loading-skeleton'
import SideViewBtn from './SIdeViewBtn'
import 'react-loading-skeleton/dist/skeleton.css'
const ChatBox = () => {
  const [identifier, setIdentifier] = useState(-1)
  const [width, setWidth] = useState(window.innerWidth)
  const [currShowUserName, setCurrShowUserName] = useState(null)
  const [currUserLogin, setCurrUserLogin] = useState({})
  useEffect(() => {
    const handleWidth = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleWidth)
    return () => {
      window.removeEventListener('resize', handleWidth)
    }
  }, [])
  const getCurrUserInfo = async () => {
    await axios
      .get(`${process.env.REACT_APP_LIVE_URL}/api/v1/chats/getLoginUser`, {
        withCredentials: true,
      })
      .then((resp) => {
        setCurrUserLogin(resp.data[0])
      })
      .catch((e) => {
        window.location.href = `${process.env.REACT_APP_LIVE_CLIENT}/login`
      })
  }
  useEffect(() => {
    getCurrUserInfo()
  }, [])
  useEffect(() => {
    console.log(currUserLogin)
  }, [currUserLogin])
  const [currShowUser, setCurrShowUser] = useState('')
  const [currFrnds, setCurrFrnds] = useState([])
  const [currSearchedFrnds, setCurrSearchedFrnds] = useState([])
  const [removeChatBar, setRemoveChatBar] = useState(false)
  const [chatRoomKey, setCurrChatRoomKey] = useState()
  const setCurrKey = (key) => {
    console.log('setting key', key)
    setCurrChatRoomKey(key)
  }
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_LIVE_URL, {
      withCredentials: true,
    })
  }, [currSearchedFrnds])
  const handleFunc1 = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/getUsers`,

        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        if (resp.data === '') {
          setCurrFrnds([])
        } else {
          setCurrFrnds(resp.data.haveFrnds)
          setCurrSearchedFrnds(resp.data.haveFrnds)
        }
      })
  }
  useEffect(() => {
    handleFunc1()
  }, [])

  const [findUsers, setFindUsers] = useState('')
  const handleOnChangeFindUsers = async (e) => {
    console.log(e.target.value)
    let newCurrFrnds = currFrnds.filter((element) =>
      element.includes(e.target.value)
    )
    console.log(newCurrFrnds)

    setCurrSearchedFrnds(newCurrFrnds)
    // console.log(newCurrFrnds)
  }
  const func = (e) => {
    console.log(e.target.value)
  }
  useEffect(() => {
    socket.on('check-status', (m) => {})
  }, [])
  const selectFromFriends = (username) => {
    if (width < 900) {
      setRemoveChatBar(!removeChatBar)
    }
    setCurrShowUser(username)
  }
  const getFromDetails = (username, picture, email) => {
    setCurrShowUserName({ username: username, picture: picture, email: email })
  }
  const initialRender = useRef(true)
  const [requestCall, setRequestCall] = useState({ isCall: false })
  const [incomingVideoCaller, setIncomingVideoCaller] = useState(false)
  const [incomingUserInfo, setIncomingUserInfo] = useState()
  const [chatRoomID, setChatRoomID] = useState()
  const [openSideOption, setOpenSideOption] = useState(false)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
    } else {
      let obj = {
        isCall: false,
        socket: socket,
        chatRoomID: chatRoomID,
        username: {
          picture: '*',
          username: '*',
        },
      }
      console.log(obj)
      setRequestCall(obj)
    }
  }, [incomingVideoCaller, chatRoomID])

  return (
    <>
      <div className='box'>
        <div
          onClick={() => {
            const sideOptionBar = document.querySelector('.sideBar')
            const hamburgerDiv = document.querySelector('.hamburger')
            const overlayMobile = document.querySelector('.overlayMobile')
            const leftComingBar = document.querySelector('.leftComingBar')

            if (!openSideOption) {
              hamburgerDiv.style.left = '80%'
              sideOptionBar.style.height = '100%'
              sideOptionBar.style.left = '0px'
              overlayMobile.style.display = 'flex'
            } else {
              hamburgerDiv.style.left = '25px'
              sideOptionBar.style.height = '100%'
              sideOptionBar.style.left = '-80px'
              overlayMobile.style.display = 'none'
              // setTimeout(() => {
              //   if (leftComingBar) leftComingBar.style.display = 'block'
              // }, 1000);
            }
            setOpenSideOption(!openSideOption)
          }}
        >
          <SideViewBtn></SideViewBtn>
        </div>
        <div className='overlayMobile'></div>
        <VideoChat
          incomingUserInfo={incomingUserInfo}
          incomingVideoCaller={incomingVideoCaller}
          setIncomingVideoCaller={setIncomingVideoCaller}
          setRequestCall={setRequestCall}
          isCall={requestCall.isCall}
          socket={socket}
          chatRoomID={requestCall.chatRoomID}
          username={requestCall.username}
          currUserLogin={currUserLogin}
        ></VideoChat>

        <section className='sideBar'>
          {currUserLogin && (
            <Profile pic={currUserLogin.picture} bg={'#262626'}></Profile>
          )}
          <SideOptions openSideOption={openSideOption}></SideOptions>
          <Settings></Settings>
        </section>
        <section
          className={removeChatBar ? `chatBar chatBarRemove` : `chatBar`}
        >
          <Search
            type={'search'}
            text={'Enter for search'}
            logo={'fa-solid fa-magnifying-glass'}
            handleOnchange={handleOnChangeFindUsers}
            func={func}
          ></Search>
          <div className='allFriends'>
            {currSearchedFrnds.map((val, i) => {
              console.log(val)
              return (
                <Friends
                  currUserLogin={currUserLogin.email}
                  io={io}
                  socket={socket}
                  username={val}
                  key={i}
                  identifier={identifier}
                  currIden={i}
                  setIdentifier={setIdentifier}
                  selectFromFriends={selectFromFriends}
                  getFromDetails={getFromDetails}
                  setCurrKey={setCurrKey}
                  setIncomingVideoCaller={setIncomingVideoCaller}
                  setChatRoomID={setChatRoomID}
                  setIncomingUserInfo={setIncomingUserInfo}
                ></Friends>
              )
            })}
          </div>
        </section>
        <section className='chats'>
          {currShowUser === '' ? (
            <>
              <div
                className={
                  width < 900 ? `welcomeBox notWelcomeBox` : `welcomeBox`
                }
              >
                <div
                  className='logoImg'
                  style={{
                    backgroundImage: `url('http://localhost:3000/resources/chat-log.png')`,
                  }}
                ></div>
                <h2>Welcome to ChatNest</h2>
                <span>
                  where conversations flow effortlessly and connections are
                  made. Join our vibrant community today and start chatting with
                  friends old and new!
                </span>
              </div>
            </>
          ) : (
            <ShowChat
              removeChatBar={removeChatBar}
              setRemoveChatBar={setRemoveChatBar}
              username={currShowUser}
              currShowUserName={currShowUserName}
              chatRoomKey={chatRoomKey}
              setRequestCall={setRequestCall}
            ></ShowChat>
          )}
        </section>
      </div>
    </>
  )
}
export default ChatBox
