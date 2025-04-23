import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'

import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import "./index.css"
import { CourseContextProvider } from './context/CourseContext.tsx'


export const server = "http://localhost:3000";


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
