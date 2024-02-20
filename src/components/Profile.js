const Profile=({pic, backG,bg,ht,wt})=>{
 return (
   <>
     <div
       className='profile button'
       style={{
         height: ht,
         width: wt,
         backgroundImage: `url(${pic})`,
         backgroundRepeat:"no-repeat",
         backgroundPosition:"center",
         backgroundSize:"contain"

       }}
     >
       <div
         className='status onlineProfile'
         style={{
           borderColor: bg,
           backgroundColor: backG,
         }}
       ></div>
       <div className='img' style={{}}></div>
     </div>
   </>
 )
}

export default Profile