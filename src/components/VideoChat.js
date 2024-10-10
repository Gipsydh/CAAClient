import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Peer from 'simple-peer'

const VideoChat = ({
  incomingUserInfo,
  incomingVideoCaller,
  setIncomingVideoCaller,
  setRequestCall,
  isCall,
  isPhoneCall,
  socket,
  chatRoomID,
  username,
  currUserLogin,
}) => {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const connectionRef = useRef(null)
  const [callState, setCallState] = useState('calling to...')
  const [videoEnabled, setVideoEnabled] = useState(null)
  const [videoWindow, setVideoWindow] = useState(false)
  const [busyLine, setBusyLine] = useState(false)
  const [stream, setStream] = useState(null)
  const [stream1, setStream1] = useState(null)
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(false)
  const [call, setCall] = useState({})
  const [pendingCall, setPendingCall] = useState(true)
  const toggleVideoRef = useRef(null)
  useEffect(() => {
    console.log('triggered')
    console.log(incomingUserInfo)
    console.log(username)
    console.log(chatRoomID)
    console.log(isCall)
    if (isCall) {
      console.log('calling to user-----')
      setVideoWindow(true)
      callUser()
    }
    console.log(incomingVideoCaller)
  }, [isCall, incomingUserInfo])

  const closeVideoWindow = () => {
    console.log('window closed triggered')
    isCall = false
    setVideoWindow(false)
    setRequestCall({ isCall: false })
  }
  socket.on('sendcallingsignal', (signal) => {
    // console.log(signal)
    // // console.log(localVideoRef)

    console.log('incoming calllll')
    setIncomingVideoCaller(true)
    setCall({ isReceivingCall: true, signal: signal.m })
  })
  socket.on('busyLine', () => {
    setBusyLine(true)
    setCallState(
      'The person you are trying to call is currently busy. Try Again Later'
    )
  })
  const makeStream = async () => {
    const currStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    console.log(currStream)
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = currStream
      // setStream(currStream)
    }
    return currStream
  }
  useEffect(() => {
    socket.on('videostreamEnabled', () => {
      console.log('videoToggling')
      setRemoteVideoEnabled(!remoteVideoEnabled)
    })
  }, [socket, remoteVideoEnabled])
  const removeVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        console.log(track.enabled)
        track.enabled = !track.enabled
      })
    }
  }
  useEffect(() => {
    if (isPhoneCall) {
      removeVideo()
      setVideoEnabled(true)
    }
  }, [stream])
  const toggleVideo = () => {
    console.log('emitting')
    socket.emit('videostreamEnabled', {
      videoEnabled,
      chatRoomID,
      username: username.email,
    })
    if (stream) {
      console.log('stopping audio')

      stream.getVideoTracks().forEach((track) => {
        console.log(track.enabled)
        track.enabled = !track.enabled
      })
      setStream(stream)
      setVideoEnabled(!videoEnabled)
    }
    if (stream1) {
      console.log('stopping audio')

      stream1.getVideoTracks().forEach((track) => {
        console.log(track.enabled)
        track.enabled = !track.enabled
      })
      setStream(stream)
      setVideoEnabled(!videoEnabled)
    }
  }
  useEffect(() => {
    if (stream) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      })

      peer.on('signal', (data) => {
        socket.emit('sendcallingsignal', {
          data,
          chatRoomID,
          username: username.email,
        })
      })

      peer.on('stream', (currentStream) => {
        remoteVideoRef.current.srcObject = currentStream
      })

      socket.on('callaccepted', (signal) => {
        // setCallAccepted(true)
        console.log(signal)
        if (peer && !peer.destroyed) {
          peer.signal(signal)
          setPendingCall(false)
        } else {
          console.error('Peer is destroyed or not created, cannot signal.')
        }
      })
      peer.on('error', (e) => {
        console.log(e)
        setPendingCall(true)
        setCallState('Some error happened :(')
      })
      console.log(connectionRef.current)
      connectionRef.current = peer
    }
  }, [stream])
  const callUser = async () => {
    try {
      const currStream = await makeStream()
      setStream(currStream)
    } catch (error) {
      console.log('error happened')
    }
  }
  useEffect(() => {
    if (stream1) {
      setIncomingVideoCaller(false)
      console.log('answering call')

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream1,
      })
      console.log(peer)
      peer.on('signal', (data) => {
        console.log(data)
        console.log(chatRoomID)
        socket.emit('answercall', { signal: data, chatRoomID })
      })
      peer.on('stream', (currentStream) => {
        console.log('call received')
        if (currentStream) {
          console.log(currentStream)
          currentStream.addEventListener('addtrack', () => {
            console.log('toggling video')
          })
          currentStream.addEventListener('removetrack', () => {
            console.log('toggling video')
          })
        }
        remoteVideoRef.current.srcObject = currentStream
        setPendingCall(false)
      })
      peer.on('error', (e) => {
        console.log(e)
        setPendingCall(true)
        setCallState('Some error happened :(')
      })
      peer.signal(call.signal.data)
      connectionRef.current = peer
    }
  }, [stream1])
  const answerCall = async () => {
    try {
      const currStream = await makeStream()
      setStream1(currStream)
    } catch (error) {
      console.log('error happened')
    }
  }
  socket.on('closeconnection', () => {
    console.log('Server requested to close connection')
    setIncomingVideoCaller(false)
    try {
      if (connectionRef.current) {
        setVideoWindow(false)
        setPendingCall(true)
        setVideoEnabled(null)
        setRemoteVideoEnabled(false)
        connectionRef.current.destroy()
        connectionRef.current = null
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop())
          localVideoRef.current.srcObject = null
        }
        setRequestCall({ isCall: false })
      }
    } catch (e) {
      console.error('Error closing connection:', e)
    }
  })
  // useEffect(() => {
  //   if (videoEnabled) {
  //     if (videoEnabled) setPendingCall(true)
  //     else setPendingCall(false)
  //   }
  // }, [videoEnabled])
  const leaveCall = () => {
    // stream.getTracks().forEach((track) => {
    //   track.stop()
    // })

    // console.log(connectionRef.current)
    setPendingCall(true)
    setVideoEnabled(null)
    setRemoteVideoEnabled(false)

    // setRemoteVideoEnabled(false)
    socket.emit('videostreamEnabled', {
      videoEnabled,
      chatRoomID,
      username: username.email,
    })
    setCallState('Calling to...')

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop())
      localVideoRef.current.srcObject = null
    }

    // Destroy peer connection
    if (connectionRef.current) {
      connectionRef.current.destroy()
      connectionRef.current = null
    }

    setStream(null)
    // Optionally, you can notify the server
    socket.emit('closeconnection', { chatRoomID })
  }
  return (
    <>
      {incomingVideoCaller ? (
        <motion.div
          initial={{
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className='incomingVideocall'
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className='userImg'
              style={{ backgroundImage: `url(${incomingUserInfo.picture})` }}
            ></div>
            <div className='info'>
              <span>incoming video call</span>
              <h3>{incomingUserInfo.fullName}</h3>
            </div>
          </div>
          <div className='controls'>
            <div
              className='answer button'
              onClick={() => {
                console.log('accepting call')
                setVideoWindow(true)

                answerCall()
                // getVideoRefs(localVideoRef, remoteVideoRef)
                // answerCall(socket, chatRoomID)
              }}
            >
              <i class='fa-solid fa-phone'></i>
            </div>
            <div
              className='reject button'
              onClick={() => {
                setIncomingVideoCaller(false)
                socket.emit('closeconnection', { chatRoomID })
              }}
            >
              <i
                class='fa-solid fa-phone'
                style={{ transform: 'rotate(136deg)' }}
              ></i>
            </div>
          </div>
        </motion.div>
      ) : (
        <></>
      )}
      {videoWindow ? (
        <>
          <motion.div
            className='videoCall'
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
          >
            <div className='videoFeedback'>
              {pendingCall ? (
                <>
                  <div
                    className='pendingCall'
                    style={{ backgroundImage: `url(${username.picture})` }}
                  >
                    <div
                      className='profile'
                      style={{ backgroundImage: 'inherit' }}
                    ></div>
                    <span>{callState}</span>
                    <h3>{username.username}</h3>
                  </div>
                </>
              ) : (
                <></>
              )}
              {remoteVideoEnabled ? (
                <>
                  <div
                    className='pendingCall'
                    style={{
                      backgroundImage: `url(${
                        incomingUserInfo !== undefined
                          ? incomingUserInfo.picture
                          : username.picture
                      })`,
                      position: 'absolute',
                      zIndex: '100',
                    }}
                  >
                    <div
                      className='profile'
                      style={{ backgroundImage: 'inherit' }}
                    ></div>
                    <span></span>
                    <h3>
                      {incomingUserInfo !== undefined
                        ? incomingUserInfo.fullName
                        : username.username}
                    </h3>
                  </div>
                </>
              ) : (
                <></>
              )}
              {/* {} */}
              <video
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                }}
                playsInline
                autoPlay
                ref={remoteVideoRef}
              ></video>
              <div className='localFeedback'>
                <video
                  muted
                  playsInline
                  autoPlay
                  style={{ height: '100%', width: '100%' }}
                  ref={localVideoRef}
                ></video>
                {videoEnabled ? (
                  <div className='innerLocalFeedbackWrapper'>
                    <div
                      className='localFeedbackUser'
                      style={{
                        backgroundImage: `url(${currUserLogin.picture})`,
                      }}
                    ></div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className='controls'>
              <div className='button ordinary'>
                <i class='fa-solid fa-volume-xmark'></i>
              </div>
              <div
                className='button danger'
                onClick={() => {
                  if (!busyLine) leaveCall()
                  setBusyLine(false)
                  if (
                    localVideoRef.current &&
                    localVideoRef.current.srcObject
                  ) {
                    localVideoRef.current.srcObject
                      .getTracks()
                      .forEach((track) => track.stop())
                    localVideoRef.current.srcObject = null
                  }
                  setCallState('Calling to...')
                  closeVideoWindow()
                }}
              >
                <span>End Call</span>
              </div>
              <div
                className='button ordinary'
                onClick={toggleVideo}
                ref={toggleVideoRef}
              >
                <i
                  style={
                    videoEnabled
                      ? { transition: '0.15s ease-in-out', color: 'red' }
                      : {}
                  }
                  class='fa-solid fa-video-slash'
                ></i>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default VideoChat
