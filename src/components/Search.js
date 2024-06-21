import { useEffect, useState,useRef } from 'react'
import AddFriend from './AddFriend'
import Emoji from './emoji/Emoji'
import EmojiPicker from 'emoji-picker-react'
const Search = ({
  type,
  text,
  logo,
  handleOnchange,
  handleEmoji,
  handleFileShare,
  msg,
  func,
  openChatFlag,
  handleCaretPosition
  
}) => {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [openAddFrnd, setOpenAddFrnd] = useState(true)
  const [currEmoji, setCurrEmoji] = useState({})
  const fileUploadRef=useRef(null);
  useEffect(() => {
    console.log('process hit',openChatFlag)
    
    if (openChatFlag === false) {
      setEmojiOpen(false)
    }
  }, [openChatFlag])
  const handleCustomFileUpload=()=>{
    fileUploadRef.current.click();
  }
  return (
    <>
      <div className='fixedNavbar'>
        <div className='search inputBar'>
          {type !== 'search' ? (
            <>
              <i
                class='fa-solid fa-face-laugh'
                onClick={() => {
                  setEmojiOpen(!emojiOpen)
                }}
              ></i>
              <input
                type='file'
                ref={fileUploadRef}
                style={{ display: 'none' }}
                onChange={handleFileShare}
                hidden
              />
              <i class='fa-solid fa-paperclip' onClick={handleCustomFileUpload}></i>

              <EmojiPicker
                open={emojiOpen}
                style={{
                  position: 'absolute',
                  bottom: '70px',
                  left: '0',
                  zIndex: '1000',
                }}
                theme='google'
                onEmojiClick={handleEmoji}
              />
            </>
          ) : (
            <>
              <i class={logo}></i>
            </>
          )}

          <input
            type='text'
            value={msg}
            placeholder={text}
            onChange={handleOnchange}
            onClick={handleCaretPosition}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                func(e)
              }
            }}
          />
        </div>
        {type === 'search' ? (
          <div className='sortBy'>
            <span>sort by</span>
            <div className='addNew'>
              <span>{openAddFrnd === false ? 'Close' : 'Add New'}</span>
              {openAddFrnd === false ? <AddFriend></AddFriend> : <></>}
              <div className='addnewBtn button'>
                <i
                  className={
                    openAddFrnd === true
                      ? 'fa-solid fa-plus'
                      : 'fa-solid fa-plus cross'
                  }
                  onClick={() => {
                    setOpenAddFrnd(!openAddFrnd)
                  }}
                ></i>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default Search
