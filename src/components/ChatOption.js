import React from 'react'

export const ChatOption = ({category,data,func}) => {

  return (
    <span onClick={()=>{
     func()
    }} className={category==="danger"?'codeDanger button':'button'} >{data}</span>
  )
}
