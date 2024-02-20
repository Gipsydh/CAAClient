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
  const [currShowUser, setCurrShowUser] = useState("")
  const [currFrnds, setCurrFrnds] = useState([])
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
    setCurrShowUser(username)
  }
  return (
    <>
      <div className='box'>
        <section className='sideBar'>
          <Profile bg={'#262626'}></Profile>
          <SideOptions></SideOptions>
          <Settings></Settings>
        </section>
        <section className='chatBar'>
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
                  selectFromFriends={selectFromFriends}
                ></Friends>
              )
            })}
          </div>
        </section>
        <section className='chats'>
          {currShowUser === '' ? (
            <>
              <div className='welcomeBox'>
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
            <ShowChat username={currShowUser}></ShowChat>
          )}
        </section>
      </div>
    </>
  )
}
export default ChatBox
