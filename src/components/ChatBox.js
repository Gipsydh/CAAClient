import Profile from './Profile'
import SideOptions from './SideOptions'
import Settings from './Settings'
import Search from './Search'
import Friends from './Friends'
import ChatHeading from './ChatHeading'
import ShowChat from './ShowChat'
import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
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
  const [removeChatBar, setRemoveChatBar] = useState(false)
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_LIVE_URL, {
      withCredentials: true,
    })
  }, [])
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
        }
      })
  }
  useEffect(() => {
    handleFunc1()
  }, [])
  const [findUsers, setFindUsers] = useState('')
  const handleOnChangeFindUsers = async (e) => {
    setFindUsers(e.target.value)
  }
  const func = (e) => {}
  useEffect(() => {
    socket.on('check-status', (m) => {})
  }, [])
  const selectFromFriends = (username) => {
    if (width < 900) {
      setRemoveChatBar(!removeChatBar)
    }
    setCurrShowUser(username)
  }
  const getFromDetails = (username, picture,email) => {
    setCurrShowUserName({ username: username, picture: picture,email:email })
  }

  return (
    <>
      <div className='box'>
        <section className='sideBar'>
          {currUserLogin && (
            <Profile pic={currUserLogin.picture} bg={'#262626'}></Profile>
          )}
          <SideOptions></SideOptions>
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
            {currFrnds.map((val, i) => {
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
            ></ShowChat>
          )}
        </section>
      </div>
    </>
  )
}
export default ChatBox
