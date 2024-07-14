import React from 'react'
import { useEffect, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import '../css/loginBtn.css'

import axios from 'axios'

const LoginCustomBtn = () => {
  const [user, setUser] = useState([])

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse)
    },
    onError: () => {
      console.log('Login Failed')
    },
  })
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json',
            },
          }
        )
        .then((res) => {
          console.log(res)

          axios
            .post(`${process.env.REACT_APP_LIVE_URL}/api/v1/login`, res.data, {
              withCredentials: true,
            })
            .then((resp) => {
              window.location.href = `${process.env.REACT_APP_LIVE_CLIENT}/chats`
            })
        })
        .catch((err) => console.log(err))
    }
  }, [user])
  return (
    <button
      className='custButton'
      onClick={() => {
        login()
      }}
    >
      <div className='bloom-container'>
        <div className='button-container-main'>
          <div className='button-inner'>
            <div className='back'></div>
            <div className='front'>
              <div
                className='specialLogo'
              ></div>
            </div>
          </div>
          <div className='button-glass'>
            <div className='back'></div>
            <div className='front'></div>
          </div>
        </div>
        <div className='bloom bloom1'></div>
        <div className='bloom bloom2'></div>
      </div>
    </button>
  )
}
export default LoginCustomBtn
