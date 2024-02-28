import axios from 'axios'
import React, { useEffect } from 'react'

export const Home = () => {
  console.log(process.env.LIVE_URL)
 useEffect(()=>{
  try {
   axios
     .get(`${process.env.REACT_APP_LIVE_URL}/api/v1/home`, {
       withCredentials: true,
     })
     .then((resp) => {
       console.log(resp)
     })
     .catch((e) => {
       console.log(e)
     })
  } catch (error) {
   
  }
 },[])
  return (
    <div>Home</div>
  )
}
