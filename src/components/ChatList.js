import { useRef, useEffect, useState } from 'react'
import axios from 'axios'
const ChatList = ({ chatRoomKey, username, list }) => {
  const goToLastBtn=useRef(null)
  useEffect(() => {
    // scrollList.scrollTop = scrollList.scrollHeight
    setTimeout(() => {
      const scrollList = document.querySelector('.chatList')
      scrollList.scrollTop = scrollList.scrollHeight
      console.log(scrollList.scrollHeight)
    }, 50)
  }, [chatRoomKey,username,list])
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    let contentDiv = document.querySelector('.chatList')
    function toggleGoDownFunc() {
      let contentDiv = document.querySelector('.chatList')
      let goToBottomBtn = document.querySelector(`.goToLast${chatRoomKey}`)
      
      if (
        contentDiv.scrollTop + 10 <
        contentDiv.scrollHeight - contentDiv.clientHeight
      ) {
        goToBottomBtn.style.display = 'flex'
      } else {
        goToBottomBtn.style.display = 'none'
      }
    }
    
    contentDiv.addEventListener('scroll', toggleGoDownFunc)
    return () => {
      contentDiv.removeEventListener('scroll', toggleGoDownFunc)
    }
  }, [chatRoomKey])
  const goDownFunc = () => {
    const scrollList = document.querySelector('.chatList')

    scrollList.scrollTop = scrollList.scrollHeight

  }
 
  return (
    <div className='chatList'>
      <div className={`goToLast goToLast${chatRoomKey}`} style={{zIndex:10}} ref={goToLastBtn} onClick={goDownFunc}>
        <i class='fa-solid fa-arrow-down'></i>
      </div>
      {list.map((val, key) => {
        let dateFormat = ''
        if (val.time !== 'Today') {
          let day = new Date()

          let pos =
            parseInt(day.getDate()) - parseInt(val.time.substring(8, 10))
          if (pos < 1) {
            dateFormat += 'Today'
          } else if (pos == 1) {
            dateFormat += 'Yestarday'
          } else {
            dateFormat += val.time.substring(0, 10)
          }
        } else {
          dateFormat = 'Today'
        }
        let resultImg = null
        if (val.mimeType !== undefined) {
          const dataBlob = new Blob([val.content], { type: val.mimeType })
          const reader = new FileReader()
          reader.readAsDataURL(dataBlob)
          reader.onloadend = function () {
            document.getElementById(`text_img${key}`).src = reader.result
          }
        }
        if (val.mimeType === undefined && val.content !== 'no_content') {
          resultImg = val.content
        }
        const downdloadImgHandler = async () => {
          const link = document.createElement('a')
          link.download = document.getElementById(`text_img${key}`).alt
          const currdata = document.getElementById(`text_img${key}`).src
          if (currdata.startsWith('http:') || currdata.startsWith('https:')) {
            fetch(
              `${
                process.env.REACT_APP_LIVE_URL
              }/proxy-img?url=${encodeURIComponent(
                document.getElementById(`text_img${key}`).src
              )}`
            )
              .then(
                (response) => response.arrayBuffer() // Get image data as ArrayBuffer
              )
              .then((arrayBuffer) => {
                // Convert ArrayBuffer to Blob
                console.log(arrayBuffer)
                let fileName = document
                  .getElementById(`text_img${key}`)
                  .src.split('.')
                  .pop()
                  .toLowerCase()

                console.log(fileName)
                if (fileName === 'jpg') fileName = 'jpeg'
                const blob = new Blob([arrayBuffer], {
                  type: `image/${fileName}`,
                }) // Adjust type as per your image type

                // Create object URL from Blob
                console.log(blob)
                const objectUrl = URL.createObjectURL(blob)
                console.log(objectUrl)
                // const link=document.createElement('a')

                // link.download = document.getElementById(`text_img${key}`).alt
                link.href = objectUrl
                link.click()
                // console.log('Object URL:', objectUrl)

                // // Display the image (example)
                // const img = new Image()
                // img.src = objectUrl
                // document.body.appendChild(img)

                // // Clean up object URL when done (optional)
                // URL.revokeObjectURL(objectUrl)
              })
              .catch((error) => {
                console.error('Error fetching image:', error)
              })
          } else {
            const image = document.getElementById(`text_img${key}`)
            let fileName = document
              .getElementById(`text_img${key}`)
              .src.split('.')
              .pop()
              .toLowerCase()

            // Create a canvas element
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            // Set canvas dimensions to the image dimensions
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight

            // Draw the image onto the canvas
            context.drawImage(image, 0, 0)

            // Create a data URL from the canvas
            const imageUrl = canvas.toDataURL(`image/${fileName}`)

            // Create an anchor element
            const link = document.createElement('a')

            // Set the download attribute with a desired file name
            link.download = 'downloaded_image.jpg'

            // Set the href to the data URL
            link.href = imageUrl

            // Programmatically click the link to trigger the download
            link.click()
          }
          // console.log(arrayBuffer)
          // console.log(new Blob([arrayBuffer.body]))
        }
        const viewImgHandler = () => {
          console.log('ck')
        }
        console.log(val)
        return (
          <div
            key={key}
            className={`chatData ${
              val.status === 'sender' ? 'chatLeft' : 'chatRight'
            }`}
          >
            {val.mimeType !== undefined ||
            (val.type !== undefined && val.type !== 'normal_text') ? (
              <>
                <div className='viewImg'>
                  <img src={resultImg} alt={val.text} />
                </div>
                <span className='content img_mod'>
                  <div className='overlay imgOverlay'>
                    <div className='imgOptions'>
                      <div className='option' onClick={viewImgHandler}>
                        <span>Open</span>
                      </div>
                      <div
                        className='option downloadImg'
                        onClick={downdloadImgHandler}
                      >
                        <span>Save</span>
                      </div>
                    </div>
                  </div>
                  <img
                    id={`text_img${key}`}
                    className='text_img'
                    src={resultImg}
                    alt={val.text}
                  />
                </span>
              </>
            ) : (
              <>
                <span className='content'>{val.msg}</span>
              </>
            )}
            <span className='msgTime'>{dateFormat}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ChatList
