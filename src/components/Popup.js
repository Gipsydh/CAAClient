const Popup=({handlePopup,width,left,bottom,message,type})=>{
 return (
   <>
     <div
       className='popUpGeneral'
       style={{ left: `${left}px`, bottom: `${bottom}px` }}
     >
       <h2>Attention!</h2>
       <span>{message}</span>
       <span className='closeBtn' onClick={handlePopup}>
         <i class='fa-solid fa-xmark'></i>
       </span>
     </div>
   </>
 )
}
export default Popup
