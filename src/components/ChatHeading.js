import Profile from './Profile'
const ChatHeading = ({
  removeChatBar,
  setRemoveChatBar,
  checkStatus,
  username,
}) => {
  return (
    <>
      <header className='chatHeading'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className='backBtn button'
            onClick={() => {
              setRemoveChatBar(!removeChatBar)
            }}
          >
            <i class='fa-solid fa-angle-left'></i>
          </div>
          <div className='userInfo'>
            <Profile
              pic={username.picture}
              backG={checkStatus === true ? '#34D859' : '#a2a2a2'}
              bg={'white'}
              ht={'40px'}
              wt={'40px'}
            ></Profile>
          </div>
          <div className='info' style={{ marginLeft: '20px' }}>
            <h5>{username.username}</h5>
            <div className='statusUser'>
              <span>{checkStatus === true ? 'Online' : 'Offline'}</span>
              <span> . </span>
              <span>Last seen 3 hours ago</span>
            </div>
          </div>
        </div>
        <div className='options'>
          <div className='button btn2'>
            <i class='fa-solid fa-phone'></i>
          </div>
          <div className='button btn2'>
            <i class='fa-solid fa-video'></i>
          </div>
          <div className='button btn2'>
            <i class='fa-solid fa-ellipsis'></i>
          </div>
        </div>
      </header>
    </>
  )
}
export default ChatHeading
