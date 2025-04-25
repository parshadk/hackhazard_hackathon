import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export default function Topbar({ onMenuClick, isSidebarCollapsed }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-5 shadow-sm z-50">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo with smooth sliding transition */}
        <div className={`hidden md:flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarCollapsed 
            ? "w-8 ml-2 opacity-100 translate-x-0" 
            : "w-0 opacity-0 -translate-x-4"
        }`}>
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0">
            <img
              src="/white.png"
              alt="EduFinance Logo"
              className="object-contain h-6 w-6 transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>

        {/* Title with smooth transition */}
        <h1 className={`text-xl font-bold text-indigo-600 hidden sm:block transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-2" : "ml-3"
        }`}>
          EduFinance
        </h1>
      </div>

      <Link
        to="/profile"
        className="flex items-center space-x-2 hover:bg-gray-50 p-1.5 rounded-md transition-colors duration-200"
      >
        <div className="w-9 h-9 rounded-full bg-blue-100 text-black flex items-center justify-center text-sm font-semibold transition-transform duration-200 hover:scale-105">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="hidden md:inline-block font-medium text-gray-800 transition-opacity duration-300">
          {user?.name || "User"}
        </span>
      </Link>
    </header>
  );
}