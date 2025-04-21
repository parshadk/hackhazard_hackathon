import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { API_URL } from "../utils/api"

interface User {
  name: string
  email: string
  xp: number
  level: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<string>
  verifyOTP: (otp: string, activationToken: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (password: string, token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const { data } = await axios.get(`${API_URL}/user/me`)
          setUser(data.user)
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem("token")
          delete axios.defaults.headers.common["Authorization"]
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      })

      localStorage.setItem("token", data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/register`, {
        name,
        email,
        password,
      })
      return data.activationToken
    } catch (error) {
      throw error
    }
  }

  const verifyOTP = async (otp: string, activationToken: string) => {
    try {
      await axios.post(`${API_URL}/user/verify`, {
        otp,
        activationToken,
      })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    setIsAuthenticated(false)
  }

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${API_URL}/user/forgot`, { email })
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (password: string, token: string) => {
    try {
      await axios.post(`${API_URL}/user/reset?token=${token}`, {
        password,
      })
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        verifyOTP,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}