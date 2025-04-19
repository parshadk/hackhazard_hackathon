import React from 'react';
import { Home, BookOpen, HelpCircle, Wallet, User, X, Radio } from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  activePage, 
  onNavigate 
}) => {
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, id: 'dashboard' },
    { name: 'Lessons', icon: <BookOpen size={20} />, id: 'lessons' },
    { name: 'Quizzes', icon: <HelpCircle size={20} />, id: 'quizzes' },
    { name: 'Wallet', icon: <Wallet size={20} />, id: 'wallet' },
    { name: 'Profile', icon: <User size={20} />, id: 'profile' },
    { name: 'Live', icon: <Radio size={20} />, id: 'live' },
  ];

  if (!isOpen) return null;

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-10">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600 flex items-center">
            EduFinance <span className="ml-2">🪙</span>
          </h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="px-4 mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
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
      </div>
    </div>
  );
};

export default MobileSidebar;