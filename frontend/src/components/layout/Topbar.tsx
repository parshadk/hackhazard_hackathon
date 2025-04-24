import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm z-50">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      
      <h1 className="text-xl font-bold text-indigo-600 hidden sm:block">EduFinance</h1>

     
      <Link
        to="/profile"
        className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-blue-100 text-black flex items-center justify-center text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="hidden md:inline-block font-medium text-gray-800">
          {user?.name || "User"}
        </span>
      </Link>
    </header>
  );
}