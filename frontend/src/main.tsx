import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'

import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import "./index.css"
import { CourseContextProvider } from './context/CourseContext.tsx'
import {ThemeProvider} from './components/theme-provider.tsx'

export const server = "http://35.153.107.170";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseContextProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

            <App />
          </ThemeProvider>
        </CourseContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
