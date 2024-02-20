import axios from 'axios'
import React, { useEffect } from 'react'

export const Home = () => {
 useEffect(()=>{
  try {
   axios.get('http://localhost:3001/api/v1/home',{
    withCredentials:true
   }).then((resp)=>{
    console.log(resp)
   }).catch((e)=>{
    console.log(e)
   })
  } catch (error) {
   
  }
 },[])
  return (
    <div>Home</div>
  )
}
