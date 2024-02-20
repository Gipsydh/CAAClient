const ChatList=({list})=>{
 return (
  <div className="chatList">
   {
    list.map((val,key)=>{
     return (<div className={`chatData ${val.status==="sender"?"chatLeft":"chatRight"}`} >
       <span>{val.msg}</span>
     </div>)
    })
   }
  </div>
 )
}

export default ChatList