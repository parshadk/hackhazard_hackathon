
import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Home, BookOpen, Wallet, User, LineChart, LogOut, Award } from "lucide-react"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const { user, logout } = useAuth()

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Course", path: "/lessons", icon: BookOpen },
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Profile", path: "/profile", icon: User },
    {name:"Quiz", path:"/quiz", icon: BookOpen},
    { name: "Live Updates", path: "/live-updates", icon: LineChart },
  ]

  return (
    <div className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Logo and app name */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">EduFinance</h1>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-gray-500">{user.level}</span>
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">XP: {user.xp}</div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.min(100, user.xp % 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}
