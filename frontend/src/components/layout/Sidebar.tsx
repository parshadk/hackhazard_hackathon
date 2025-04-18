import React from 'react';
import { Home, BookOpen, HelpCircle, Wallet, User } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, id: 'dashboard' },
    { name: 'Lessons', icon: <BookOpen size={20} />, id: 'lessons' },
    { name: 'Quizzes', icon: <HelpCircle size={20} />, id: 'quizzes' },
    { name: 'Wallet', icon: <Wallet size={20} />, id: 'wallet' },
    { name: 'Profile', icon: <User size={20} />, id: 'profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed top-0 left-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center">
          EduFinance <span className="ml-2">🪙</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activePage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Need help?</p>
          <p className="text-xs text-blue-600 mt-1">Contact support</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;