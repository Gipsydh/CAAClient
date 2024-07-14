import "../css/SideViewBtn.css"
const SideViewBtn=()=>{
 return (
   <div className='hamburger'>
     <input className='checkbox' type='checkbox' />
     <svg fill='none' viewBox='0 0 50 50' style={{height:"100%", width:"100%"}}>
       <path
         className='lineTop line'
         stroke-linecap='round'
         stroke-width='4'
         stroke='black'
         d='M6 11L44 11'
       ></path>
       <path
         stroke-linecap='round'
         stroke-width='4'
         stroke='black'
         d='M6 24H43'
         className='lineMid line'
       ></path>
       <path
         stroke-linecap='round'
         stroke-width='4'
         stroke='black'
         d='M6 37H43'
         className='lineBottom line'
       ></path>
     </svg>
   </div>
 )
}       
export default SideViewBtn