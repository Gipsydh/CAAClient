import { useRef, useEffect } from 'react'
const ChatList = ({ username, list }) => {
  useEffect(() => {
    const scrollList = document.querySelector('.chatList')
    console.log('curruser' + username)
    scrollList.scrollTop = scrollList.scrollHeight
  }, [list])

  return (
    <div className='chatList'>
      {list.map((val, key) => {
        console.log(val)
        return (
          <div
            key={key}
            className={`chatData ${
              val.status === 'sender' 
                ? 'chatLeft'
                : 'chatRight'
            }`}
          >
            <span>{val.msg}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ChatList
