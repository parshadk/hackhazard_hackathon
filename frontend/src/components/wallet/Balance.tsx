import React from 'react';
import Card from '../common/Card';

interface BalanceProps {
  balance: number;
  onTopUp: () => void;
}

const Balance: React.FC<BalanceProps> = ({ balance, onTopUp }) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">EduCoin Balance</h3>
        <button
          onClick={onTopUp}
          className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Top Up
        </button>
      </div>
      
      <div className="flex items-center justify-center py-6">
        <span className="text-4xl font-bold mr-2">{balance}</span>
        <span className="text-2xl">🪙</span>
      </div>
      
      <p className="text-center text-sm text-blue-100">
        Earn coins by completing lessons and quizzes
      </p>
    </Card>
  );
};

export default Balance;