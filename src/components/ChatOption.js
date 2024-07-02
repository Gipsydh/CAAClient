import React from 'react'

export const ChatOption = ({category,data,func}) => {

  return (
    <span onClick={()=>{
     func()
    }} 
    style={{margin:"10px 0px"}}
    className={`${category} button`} >{data}</span>
  )
}
