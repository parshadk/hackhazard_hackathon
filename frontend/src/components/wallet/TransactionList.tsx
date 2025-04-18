import React from 'react';
import Card from '../common/Card';
import { ArrowDown, ArrowUp, ShoppingBag } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'earned' | 'sent' | 'redeemed';
  amount: number;
  description: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <ArrowDown size={18} className="text-green-600" />;
      case 'sent':
        return <ArrowUp size={18} className="text-blue-600" />;
      case 'redeemed':
        return <ShoppingBag size={18} className="text-purple-600" />;
      default:
        return null;
    }
  };

  const getTransactionClass = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600';
      case 'sent':
        return 'text-blue-600';
      case 'redeemed':
        return 'text-purple-600';
      default:
        return '';
    }
  };

  return (
    <Card className="p-5">
      <h3 className="font-medium text-gray-900 mb-4">Recent Transactions</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="py-3 flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                {getTransactionIcon(transaction.type)}
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
              
              <div className={`font-medium ${getTransactionClass(transaction.type)}`}>
                {transaction.type === 'earned' ? '+' : '-'}
                {transaction.amount} 🪙
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TransactionList;