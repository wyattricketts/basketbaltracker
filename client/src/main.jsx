import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import Home from './Home.jsx'

const GOOGLE_CLIENT_ID = "625315434824-0ol6n2t84cuaf967etncrk90l2kbkjtm.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Home />
    </GoogleOAuthProvider>
  </StrictMode>,
)
