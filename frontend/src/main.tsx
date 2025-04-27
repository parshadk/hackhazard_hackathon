import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'

import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import "./index.css"
import { CourseContextProvider } from './context/CourseContext.tsx'


export const server = "https://edufinance-backend-production.up.railway.app";
// export const server = "https://hackhazardhackathon-production.up.railway.app";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseContextProvider>
          

            <App />
          
        </CourseContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
