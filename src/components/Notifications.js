import SingleNotification from "./SingleNotification"
import { useEffect, useState } from "react"
import axios from "axios"
const Notifications=()=>{
 const [notification,setNotification] = useState([])
 const handleNotification=async()=>{
  await axios
    .get(`${process.env.REACT_APP_LIVE_URL}/api/v1/chats/getNotification`, {
      withCredentials: true,
    })
    .then((resp) => {
      setNotification(resp.data)
    })
 }
 useEffect(()=>{
  handleNotification()
 },[])
 return (
   <>
     <div className='leftComingBar'>
       <div className='heading'>
         <h2>Notifications</h2>
       </div>
       <div className='allNotifications'>
         {
          notification.map((val,i)=>{
           return <SingleNotification user={val} key={i}></SingleNotification>
          })
         }
       </div>
     </div>
   </>
 )
}

export default Notifications