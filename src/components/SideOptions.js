import { useEffect, useState } from "react"
import sideOptns from "../data/sideOption.json"
import Notifications from "./Notifications"
const SideOptions = (openSideOption) => {
  const [optionNumber, setOptionNumber] = useState(0)
  useEffect(()=>{
    setOptionNumber(0)
  },[openSideOption])
  const handleSideoption = (i) => {
    console.log(openSideOption)
    console.log(i)
    setOptionNumber(i)
  }
  return (
    <>
      <div className='sideOptions'>
        {sideOptns.map((val, i) => {
          return (
            <>
              <div className={`btn1 sideOptn ${val.name}`}>
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

        {(openSideOption && optionNumber === 1)? <Notifications />:<></>}
      </div>
    </>
  )
}
export default SideOptions