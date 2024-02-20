import { useState } from "react"
import Search from "./Search"
import axios from "axios"
import ShowUsers from "./ShowUsers"
const AddFriend=()=>{
 const [searchFriend,setSearchFriend]=useState("")
 const [userList,setUserList]=useState([])

 return (
   <>
     <div className='addFriend'>
       <div className='search inputBar' style={{
        marginBottom:"20px"
       }}>
         <i class='fa-solid fa-magnifying-glass'></i>
         <input type='text' value={searchFriend} placeholder="Enter your Friend's name or email" onChange={async(e)=>{
          setSearchFriend(e.target.value)
          await axios.post('http://localhost:3001/api/v1/chats/getSimilarUser',{
           userName:searchFriend
          },{
           withCredentials:true
          }).then((resp)=>{
           setUserList(resp.data)
          })
         
         }} onKeyDown={(e)=>{
           if (e.key === 'Enter') {
             setSearchFriend('')
           }
         }}/>
       </div>
       <div className="allFriends">
        {
         userList.map((val,i)=>{
          return <ShowUsers user={val}></ShowUsers>
         })
        }
       </div>
     </div>
   </>
 )
}
export default AddFriend