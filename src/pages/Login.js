import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
export const Login = () => {
  return (
    <GoogleOAuthProvider clientId='854963383011-bfcj46p7d506r3i9ivin8hvad05mh087.apps.googleusercontent.com'>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          let decode = jwtDecode(credentialResponse.credential)
          axios.post('http://localhost:3001/api/v1/login', decode, {
            withCredentials: true,
          })
        }}
        onError={() => {
          console.log('Login Failed')
        }}
      />
    </GoogleOAuthProvider>
  )
}
