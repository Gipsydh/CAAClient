import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import LoginCustomBtn from '../components/LoginCustomBtn'
import '../css/login.css'
export const Login = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_KEY}>
      <div className='container' style={{overflow:'hidden'}}>
        {/* <section id='up'></section>
        <section id='down'></section>
        <section id='left'></section>
        <section id='right'></section> */}
        <div className='left'>
          {/* <div className='logo'>
            <div className='lg'></div>
            <span>ChatNest</span>
          </div>
          <h2 style={{ marginBottom: '90px', marginTop: '10px' }}>
            {' '}
            Log in to your account
          </h2> */}
          {/* <GoogleLogin
            type='icon'
            size='large'
            shape='circle'
            onSuccess={(credentialResponse) => {
              let decode = jwtDecode(credentialResponse.credential)
              axios
                .post(
                  `${process.env.REACT_APP_LIVE_URL}/api/v1/login`,
                  decode,
                  {
                    withCredentials: true,
                  }
                )
                .then((resp) => {
                  window.location.href = `${process.env.REACT_APP_LIVE_CLIENT}/chats`
                })
            }}
            onError={() => {
              console.log('Login Failed')
            }}
          /> */}
          <div className='pointMsg'>
            <span>Login with Google</span>
          </div>
          <LoginCustomBtn></LoginCustomBtn>
        </div>
        <div className='right'>
          <div className='upper'>
            <h2>ChatNest</h2>
            <span>Connect, Chat, Share, Explore Together</span>
          </div>
          <div className='lower'>
            <span className='info'>
              Welcome to our Chatting App, where connections come to life!
              Seamlessly blending simplicity with sophistication, our app is
              your gateway to effortless communication. With intuitive features
              and a user-friendly interface, chatting has never been more
              convenient. Join us as we redefine the way you connect with
              friends, family, and colleagues. Welcome to a world of endless
              conversations
            </span>
            <br />
            <span className='info'>- ChatNest</span>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
