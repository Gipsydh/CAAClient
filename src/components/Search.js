import { useState } from "react"
import AddFriend from "./AddFriend"
const Search = ({ type, text, logo, handleOnchange,msg,func }) => {
  const [openAddFrnd,setOpenAddFrnd]=useState(true)
  return (
    <>
      <div className='fixedNavbar'>
        <div className='search inputBar'>
          <i class={logo}></i>
          <input
            type='text'
            value={msg}
            placeholder={text}
            onChange={handleOnchange}
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
