import Search from './Search'

const SendChat = ({ func, handleOnchange, msg }) => {
  return (
    <>
      <div className='sendChat'>
        <Search
          type={'send'}
          text={'type a message here'}
          logo={'fa-solid fa-paperclip'}
          handleOnchange={handleOnchange}
          msg={msg}
          func={func}
        ></Search>
        <div className='sendBtn button' onClick={func}>
          <i class='fa-regular fa-paper-plane'></i>
        </div>
      </div>
    </>
  )
}
export default SendChat
