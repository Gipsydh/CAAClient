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
        let dateFormat = ''
        if(val.time!=="Today"){

          let day = new Date()
  
          let pos = parseInt(day.getDate()) - parseInt(val.time.substring(8, 10))
          if (pos < 1) {
            dateFormat += 'Today'
          } else if (pos == 1) {
            dateFormat += 'Yestarday'
          } else {
            dateFormat += val.time.substring(0, 10)
          }
        }else{
          dateFormat="Today"
        }
       
        return (
          <div
            key={key}
            className={`chatData ${
              val.status === 'sender' ? 'chatLeft' : 'chatRight'
            }`}
          >
            <span className='content'>{val.msg}</span>
            <span className='msgTime'>{dateFormat}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ChatList
