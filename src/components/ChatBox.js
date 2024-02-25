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
  const [identifier,setIdentifier]=useState(-1)
  const [width, setWidth] = useState(window.innerWidth)
  const[currShowUserName, setCurrShowUserName]=useState('')
  useEffect(() => {
    const handleWidth = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleWidth)
    return () => {
      window.removeEventListener('resize', handleWidth)
    }
  }, [])
  const [currShowUser, setCurrShowUser] = useState('')
  const [currFrnds, setCurrFrnds] = useState([])
  const [removeChatBar,setRemoveChatBar]=useState(false)
  const socket = useMemo(() => {
    return io('http://localhost:3001', {
      withCredentials: true,
    })
  }, [])
  const handleFunc1 = async () => {
    await axios
      .get(
        'http://localhost:3001/api/v1/chats/getUsers',

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
    if(width<700){
      setRemoveChatBar(!removeChatBar);
    }
    setCurrShowUser(username)
  }
  const getFromDetails=(username)=>{
    setCurrShowUserName(username)
  }

  return (
    <>
      <div className='box'>
        <section className='sideBar'>
          <Profile bg={'#262626'}></Profile>
          <SideOptions></SideOptions>
          <Settings></Settings>
        </section>
        <section className={removeChatBar?`chatBar chatBarRemove`:`chatBar`}>
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
        <section className='chats' >
          {currShowUser === '' ? (
            <>
              <div
                className={
                  width < 700 ? `welcomeBox notWelcomeBox` : `welcomeBox`
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
            <ShowChat removeChatBar={removeChatBar} setRemoveChatBar={setRemoveChatBar} username={currShowUser} currShowUserName={currShowUserName}></ShowChat>
          )}
        </section>
      </div>
    </>
  )
}
export default ChatBox
