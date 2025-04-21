
import { Bell, Menu } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
      <button onClick={onMenuClick} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden">
        <Menu className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center space-x-4">
        <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
