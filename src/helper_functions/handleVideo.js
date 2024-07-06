import Peer from 'simple-peer'
let localStream
let remoteStream
let peerConnection
let didIOffer = false

let localVideoRef
let remoteVideoRef

let localsocket

const getVideoRefs = (a, b) => {
  localVideoRef = a
  remoteVideoRef = b
}

let peerConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
}

const call = async (chatRoomID, socket, username) => {
  await fetchUserMedia()
  await callUser(undefined, socket, chatRoomID, username)
}

const fetchUserMedia = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      localVideoRef.current.srcObject = stream
      localStream = stream
      // localVideoRef.current.play()
      resolve()
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}
const callUser = (offerObj, socket, chatRoomID, username) => {
      localsocket=socket
      const peer = new Peer({ initiator: true, trickle: false, localStream })
      peer.on('signal', (data) => {
        socket.emit('sendcallingsignal', { signal: data, chatRoomID })
      })
      peer.on('stream', (currentStream) => {
        remoteVideoRef.current.srcObject = currentStream
      })
      socket.on('callaccepted', (signal) => {
        console.log("call accepted")
        peer.signal(signal)
      })
 
}
const answerCall = async (socket, chatRoomID) => {
  await fetchUserMedia()

  console.log('checking1')
  console.log(localStream)
  const peer = new Peer({ initiator: true, trickle: false, localStream })
  peer.on('signal', (data) => {
    console.log(data)
    socket.emit('answercall', { signal: data, chatRoomID })
  })
  peer.on('stream', (currentStream) => {
    console.log(currentStream)
    remoteVideoRef.current.srcObject = currentStream
  })
}
export { call, getVideoRefs, answerCall }
