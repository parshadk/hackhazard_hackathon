import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Balance from '../components/wallet/Balance';
import TransactionList from '../components/wallet/TransactionList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { X } from 'lucide-react';

interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const [showTopUp, setShowTopUp] = useState(false);

  // Mock data for wallet
  const balance = 375;
  const transactions = [
    {
      id: 't1',
      type: 'earned' as const,
      amount: 50,
      description: 'Completed "Understanding Credit Scores" Quiz',
      date: 'May 15, 2025 • 10:30 AM',
    },
    {
      id: 't2',
      type: 'earned' as const,
      amount: 75,
      description: 'Completed "Budgeting 101" Lesson',
      date: 'May 14, 2025 • 2:15 PM',
    },
    {
      id: 't3',
      type: 'redeemed' as const,
      amount: 100,
      description: 'Redeemed Gift Card',
      date: 'May 10, 2025 • 4:45 PM',
    },
    {
      id: 't4',
      type: 'sent' as const,
      amount: 25,
      description: 'Sent to @frienduser',
      date: 'May 8, 2025 • 11:20 AM',
    },
    {
      id: 't5',
      type: 'earned' as const,
      amount: 200,
      description: 'Daily Streak Bonus (7 days)',
      date: 'May 7, 2025 • 9:00 AM',
    },
  ];

  const handleTopUp = () => {
    setShowTopUp(true);
  };

  return (
    <PageContainer
      title="Wallet"
      description="Manage your EduCoins"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Balance 
            balance={balance} 
            onTopUp={handleTopUp} 
          />
          
          <Card className="p-5 mt-6">
            <h3 className="font-medium text-gray-900 mb-4">What You Can Do</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Earn More EduCoins</h4>
                <p className="text-sm text-blue-600 mt-1">
                  Complete lessons, quizzes, and maintain daily streaks
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Send EduCoins</h4>
                <p className="text-sm text-green-600 mt-1">
                  Share coins with friends on EduFinance
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">Redeem Rewards</h4>
                <p className="text-sm text-purple-600 mt-1">
                  Exchange coins for gift cards and other rewards
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <TransactionList transactions={transactions} />
        </div>
      </div>
      
      {showTopUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowTopUp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Up EduCoins</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[100, 250, 500, 1000, 2500, 5000].map((amount) => (
                <button
                  key={amount}
                  className="bg-gray-100 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center justify-center mb-1">
                    <span className="font-medium">{amount}</span>
                    <span className="ml-1">🪙</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ${(amount / 100).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-gray-600 text-sm mb-4">
                Payment Method
              </p>
              
              <div className="flex border border-gray-200 rounded-lg p-3 items-center mb-4">
                <div className="w-10 h-6 bg-gray-200 rounded mr-3"></div>
                <span className="text-gray-600">•••• •••• •••• 4242</span>
              </div>
              
              <Button className="w-full">
                Proceed to Payment
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Payments processed securely via Razorpay
            </p>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};

export default Wallet;