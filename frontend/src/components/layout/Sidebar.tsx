import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  Home,
  BookOpen,
  Wallet,
  User,
  LineChart,
  LogOut,
  Award,
  Shield,
  Bot
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const { user, logout, loading } = useAuth()
  const [activePath, setActivePath] = useState("")

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Courses", path: "/lessons", icon: BookOpen },
    { name: "AI Quiz", path: "/quiz", icon: BookOpen },
    { name: "Explain with AI", path: "/explain", icon: Bot },
    { name: "Live Updates", path: "/live-updates", icon: LineChart },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Transaction History", path: "/wallet", icon: Wallet },
  ]

  const handleNavClick = (path: string) => {
    setActivePath(path)
  }

  console.log(loading, user)

  return (
    <div className={`w-64 bg-white border-r border-gray-200 flex flex-col h-full ${className}`}>
      {/* Logo and app name */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
        <img src="/white.png" alt="EduFinance Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-gray-800">EduFinance</h1>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className="block text-sm text-gray-500">{user.level}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>XP: {user.xp}</span>
                <span>Level {Math.floor(user.xp / 100) + 1}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, user.xp % 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => handleNavClick(item.path)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm rounded-lg transition-all transform ${
                isActive 
                  ? "bg-primary-100 text-primary-600 font-medium border-l-4 border-primary-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-md"
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
            {activePath === item.path && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary-600"></span>
            )}
          </NavLink>
        ))}

        {/* Admin only item */}
        {!loading && user && user.role === "admin" && (
          <NavLink
            to="/admin"
            onClick={() => handleNavClick("/admin")}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm rounded-lg transition-all transform ${
                isActive 
                  ? "bg-primary-100 text-primary-600 font-medium border-l-4 border-primary-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-md"
              }`
            }
          >
            <Shield className="h-5 w-5 mr-3" />
            Admin
            {activePath === "/admin" && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary-600"></span>
            )}
          </NavLink>
        )}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-md transition-all transform"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}
   