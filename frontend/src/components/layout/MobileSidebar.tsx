
import { X } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Home, BookOpen, Wallet, User, LineChart, LogOut, Award ,Bot} from "lucide-react"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { user, logout } = useAuth()

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Courses", path: "/lessons", icon: BookOpen },
    // { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "AI Quiz", path: "/quiz", icon: BookOpen },
    { name: "Explain with AI", path: "/explain", icon: Bot },
    { name: "Live Updates", path: "/live-updates", icon: LineChart },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Transaction History", path: "/wallet", icon: Wallet },
  ]

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img src="/white.png" alt="EduFinance Logo" className="h-6 w-6" />
            <h1 className="text-lg font-bold">EduFinance</h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
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
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                  isActive ? "bg-primary-100 text-primary-600 font-medium border-l-4 border-primary-600"  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
