import ChatBox from './components/ChatBox'
import './css/color.css'
import './css/generals.css'
import './css/chatBox.css'
import { Home } from './pages/Home'
import Chats from './pages/Chats'
import { Login } from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { jwtDecode } from 'jwt-decode'
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' >
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='chats' element={<Chats />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <GoogleOAuthProvider clientId='854963383011-bfcj46p7d506r3i9ivin8hvad05mh087.apps.googleusercontent.com'>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            let decode=jwtDecode(credentialResponse.credential)
            console.log(decode)
          }}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      </GoogleOAuthProvider> */}
    </div>
  )
}

export default App
