import { useState, useEffect, useRef } from 'react'
import { ChatOption } from './ChatOption'
import themeColors from '../data/themes.json'
import { motion, useAnimate, usePresence } from 'framer-motion'
// import { call, getVideoRefs, answerCall } from '../helper_functions/handleVideo'
import Profile from './Profile'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { io } from 'socket.io-client'
import { useMemo } from 'react'
const ChatHeading = ({
  removeChatBar,
  setRemoveChatBar,
  username,
  chatRoomID,
  setChatList,

  openChatFlag,
  setOpenChatFlag,
  handlePopup,
  setRequestCall,
}) => {
  const [checkStatus, setCheckStatus] = useState('none')
  const [lastEntry, setLastEntry] = useState()
  const [openOptions, setOpenOptions] = useState(false)
  const [themeFlag, setThemeFlag] = useState(false)
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_LIVE_URL, {
      withCredentials: true,
    })
  }, [username])
  // const getUserMedia = async () => {
  //   try {
  //     await navigator.mediaDevices
  //       .getUserMedia({ video: true })
  //       .then((currentStream) => {
  //         if (localVideoRef.current){
  //           console.log("going to set")
  //           console.log(currentStream)
  //           setStream(currentStream)
  //           localVideoRef.current.srcObject = currentStream
  //         }
  //       })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // socket.on('callUser', ({ from, name: callerName, signal }) => {
  //   setCall({ isReceivingCall: true, from, name: callerName, signal })
  // })

  // useEffect(() => {
  //   getVideoRefs(localVideoRef, remoteVideoRef)
  // }, [localVideoRef, remoteVideoRef])
  useEffect(() => {
    setOpenOptions(false)
  }, [username])
  // useEffect(() => {
  //   setCheckStatus('none')
  // }, [username])
  function findObjByProperty(array, prop, propval) {
    return array.find(function (obj) {
      return obj[prop] === propval
    })
  }
  useEffect(() => {
    setRequestCall({
      isCall: false,
      username: username,
      chatRoomID: chatRoomID,
    })
  }, [])
  useEffect(
    () => {
      console.log('again rendering')
      console.log(socket)
      // if (socket)
      socket.on('online-status', (resp) => {
        console.log('getting socket resp')
        console.log(resp)
        // if (resp.includes(username)) {
        //   setCheckStatus(true)
        // } else {
        //   setCheckStatus(false)
        // }
        // console.log(resp)
        console.log(username.email)
        let findVal = findObjByProperty(resp, 'data', username.email)
        console.log(findVal)
        if (
          findVal &&
          findVal.data === username.email &&
          findVal.time === 'now'
        ) {
          setCheckStatus('online')
          setLastEntry('now')
        } else {
          setCheckStatus('offline')
          if (findVal && findVal.data === username.email) {
            setLastEntry()
            let dateToSubstract = new Date(findVal.time)
            let currDate = new Date()
            let substractedDate = currDate - dateToSubstract
            let difftimemin = substractedDate / 1000 / 60
            difftimemin = Math.floor(difftimemin)
            if (difftimemin > 59) {
              difftimemin /= 60
              difftimemin = Math.floor(difftimemin)
              if (difftimemin > 23) {
                difftimemin /= 24
                difftimemin = Math.floor(difftimemin)
                setLastEntry(difftimemin + ' days ago')
              }
              setLastEntry(difftimemin + ' hr ago')
            } else {
              setLastEntry(difftimemin + ' min ago')
            }
            console.log(findVal.time)
          }
        }
      })
    },
    // console.log(socket)
    [socket, username]
  )

  const updateCSSVariables = (variables) => {
    console.log(variables)
    for (const [key, value] of Object.entries(variables)) {
      document.documentElement.style.setProperty(key, value)
    }
    setThemeFlag(false)
  }
  const handleThemeColor = () => {
    console.log('check')
    setThemeFlag(true)
  }
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
  const handleUnfriend = async () => {
    try {
      if (window.confirm('Are you sure Unfriend this user?')) {
        await axios.post(
          `${process.env.REACT_APP_LIVE_URL}/api/v1/chats/userUnfriend`,
          {
            username: username,
          },
          {
            withCredentials: true,
          }
        )
      }
    } catch (error) {}
  }
  
  return (
    <>
      {themeFlag ? (
        <div className='overlayTheme'>
          <motion.div
            className='chooseTheme'
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className='closeBtn'>
              <i
                class='fa-solid fa-xmark'
                onClick={() => setThemeFlag(false)}
              ></i>
            </div>
            <div className='heading'>
              <h3>Themes</h3>
            </div>
            <div className='options'>
              {themeColors.map((val, i) => {
                return (
                  <div
                    className='cardColor'
                    onClick={() => updateCSSVariables(val.colorSets)}
                  >
                    <div className='preview'>
                      <div
                        className='upper'
                        style={{ backgroundColor: val.viewUp }}
                      ></div>
                      <div
                        className='lower'
                        style={{ backgroundColor: val.viewDown }}
                      ></div>
                    </div>
                    <span>{val.name}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        <></>
      )}
      <header className='chatHeading'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className='backBtn button'
            onClick={() => {
              document.querySelector('.hamburger').style.display = 'flex'
              setRemoveChatBar(!removeChatBar)
              handlePopup()
            }}
          >
            <i class='fa-solid fa-angle-left'></i>
          </div>
          <div className='userInfo'>
            <Profile
              pic={username.picture}
              backG={checkStatus === 'online' ? '#34D859' : '#a2a2a2'}
              bg={'white'}
              ht={'40px'}
              wt={'40px'}
            ></Profile>
          </div>
          <div className='info' style={{ marginLeft: '20px' }}>
            <h5>{username.username}</h5>
            <div className='statusUser'>
              {checkStatus === 'none' ? (
                <Skeleton />
              ) : (
                <>
                  <span> {checkStatus}</span>
                  <span> . </span>
                  <span>{lastEntry}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='options'>
          <div className='button btn2' title='Coming soon'>
            <i
              class='fa-solid fa-phone'
              onClick={() => {
                setRequestCall({
                  isPhoneCall:true,
                  isCall: true,
                  username: username,
                  chatRoomID: chatRoomID,
                })
              }}
            ></i>
          </div>
          <div
            className='button btn2'
            title='currently in a beta stage. If any problem happens, simply refresh the page and also ask your friend to do the same'
          >
            <i
              class='fa-solid fa-video'
              onClick={() => {
                setRequestCall({
                  isCall: true,
                  username: username,
                  chatRoomID: chatRoomID,
                })
              }}
            ></i>
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
              category={'codeGeneral'}
              data={'Themes'}
              func={handleThemeColor}
            ></ChatOption>
            <ChatOption
              category={'codeDanger'}
              data={'Delete all chats'}
              func={handleChatDelete}
            ></ChatOption>
            <ChatOption
              category={'codeDanger'}
              data={'Unfriend this user'}
              func={handleUnfriend}
            ></ChatOption>
          </div>
        )}
      </header>
    </>
  )
}
export default ChatHeading
