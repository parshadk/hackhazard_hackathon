import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  BookOpen,
  Wallet,
  User,
  LineChart,
  LogOut,
  Shield,
  Bot,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  className?: string;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ className = "", isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout, loading } = useAuth();
  const [activePath, setActivePath] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (isNowMobile) setIsCollapsed(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Courses", path: "/lessons", icon: BookOpen },
    { name: "AI Quiz", path: "/quiz", icon: BookOpen },
    { name: "Explain with AI", path: "/explain", icon: Bot },
    { name: "Live Updates", path: "/live-updates", icon: LineChart },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Transaction History", path: "/wallet", icon: Wallet },
  ];

  const handleNavClick = (path: string) => {
    setActivePath(path);
    if (isMobile) setIsCollapsed(true);
  };

  const getLevel = (xp: number) => Math.floor(xp / 100) + 1;
  const getXPProgress = (xp: number) => xp % 100;

  const level = user ? getLevel(user.xp) : 1;
  const xpProgress = user ? getXPProgress(user.xp) : 0;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div
        className={`fixed md:relative z-20 top-0 left-0 h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden ${
          isCollapsed ? "w-20" : "w-64"
        } ${className}`}
      >
        {/* Header: Logo and toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between pr-6">
          <div className="flex items-center space-x-3">
            {/* Logo (visible only when sidebar is not collapsed) */}
            {!isCollapsed && (
              <div className="w-10 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white ml-1">
                <img
                  src="/white.png"
                  alt="EduFinance Logo"
                  className="object-contain h-8 w-8"
                />
              </div>
            )}
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
                EduFinance
              </h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="ml-auto p-1 rounded-md hover:bg-gray-100 transition"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div
            className="p-4 border-b border-gray-200 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-primary-600 font-medium text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div>
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">Level {level}</div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>XP: {user.xp}</span>
                  <span>Level {level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${xpProgress}%`,
                      background: "linear-gradient(to right, #7F00FF, #E100FF)",
                      boxShadow: "0 0 6px rgba(127, 0, 255, 0.5)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 text-sm rounded-lg transition-all transform ${
                  isActive
                    ? "bg-primary-100 text-primary-600 font-medium border-l-4 border-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-md"
                }`
              }
            >
              <item.icon className="h-6 w-6 mr-3" />
              {!isCollapsed && item.name}
              {activePath === item.path && !isCollapsed && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary-600"></span>
              )}
            </NavLink>
          ))}

          {!loading && user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={() => handleNavClick("/admin")}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 text-sm rounded-lg transition-all transform ${
                  isActive
                    ? "bg-primary-100 text-primary-600 font-medium border-l-4 border-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-md"
                }`
              }
            >
              <Shield className="h-6 w-6 mr-3" />
              {!isCollapsed && "Admin"}
              {activePath === "/admin" && !isCollapsed && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary-600"></span>
              )}
            </NavLink>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={`flex items-center px-3 py-3 text-sm rounded-lg transition-all transform ${
              isCollapsed ? "justify-center" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-md"
            }`}
          >
            <LogOut className="h-6 w-6" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}