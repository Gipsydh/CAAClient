import Profile from "./Profile"
const ChatHeading=({checkStatus})=>{
 return (
   <>
     <header className='chatHeading'>
       <div className='userInfo'>
         <Profile backG={checkStatus===true?"#34D859":"#a2a2a2"} bg={'white'} ht={"40px"} wt={"40px"}></Profile>
         <div className='info'>
           <h5>Steve Williams</h5>
           <div className='statusUser'>
             <span>{checkStatus===true?"Online":"Offline"}</span>
             <span>      .       </span>
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