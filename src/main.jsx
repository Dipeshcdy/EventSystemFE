import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>

    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
    <Toaster />
  </>
  // </StrictMode>,
)
