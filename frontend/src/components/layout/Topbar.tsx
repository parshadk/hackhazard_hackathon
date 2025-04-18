import React from 'react';
import { Bell, Menu } from 'lucide-react';
import Avatar from '../common/Avatar';
import ProgressBar from '../common/Progress';

interface TopbarProps {
  xp: number;
  maxXp: number;
  coins: number;
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ xp, maxXp, coins, toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="md:hidden text-xl font-bold text-blue-600 ml-2 flex items-center">
            EduFinance <span className="ml-1">🪙</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="hidden md:block w-48">
            <ProgressBar
              value={xp}
              max={maxXp}
              variant="xp"
              size="sm"
              label="XP"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
              <span className="text-yellow-700 font-medium">{coins}</span>
              <span className="ml-1">🪙</span>
            </div>
            
            <div className="relative">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            
            <Avatar size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;