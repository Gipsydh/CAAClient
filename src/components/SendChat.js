import Search from './Search'

const SendChat = ({
  func,
  handleOnchange,
  handleEmoji,
  handleFileShare,
  msg,
  caretPosition,
  openChatFlag, 
  handleCaretPosition
}) => {
  return (
    <>
      <div className='sendChat'>
        <Search
          type={'send'}
          text={'type a message here'}
          logo={'fa-solid fa-paperclip'}
          handleOnchange={handleOnchange}
          handleEmoji={handleEmoji}
          handleFileShare={handleFileShare}
          msg={msg}
          func={func}
          openChatFlag={openChatFlag}
          handleCaretPosition={handleCaretPosition}
        ></Search>
        <div className='sendBtn button' onClick={func}>
          <i class='fa-regular fa-paper-plane'></i>
        </div>
      </div>
    </>
  )
}
export default SendChat
