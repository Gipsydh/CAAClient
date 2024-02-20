import { useState } from "react"
import sideOptns from "../data/sideOption.json"
import Notifications from "./Notifications"
const SideOptions=()=>{
  const [optionNumber,setOptionNumber]=useState(0)
  const handleSideoption=(i)=>{
    setOptionNumber(i)
  }
 return (
   <>
     <div className='sideOptions'>
       {sideOptns.map((val, i) => {
         return (
           <>
             <div className='btn1 sideOptn'>
               <i
                 className={val.logo}
                 id={i}
                 onClick={() => {
                   handleSideoption(i)
                 }}
               ></i>
             </div>
           </>
         )
       })}
       {optionNumber === 1 ? (
         <>
           <Notifications></Notifications>
         </>
       ) : (
         <></>
       )}
     </div>
   </>
 )
}
export default SideOptions