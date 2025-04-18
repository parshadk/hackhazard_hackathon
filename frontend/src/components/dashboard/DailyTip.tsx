import React from 'react';
import Card from '../common/Card';
import { LightbulbIcon } from 'lucide-react';

interface DailyTipProps {
  tip: string;
  date: string;
}

const DailyTip: React.FC<DailyTipProps> = ({ tip, date }) => {
  return (
    <Card className="p-5 border-l-4 border-l-yellow-400">
      <div className="flex items-start">
        <div className="bg-yellow-100 p-2 rounded-full mr-4">
          <LightbulbIcon className="text-yellow-600" size={18} />
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Daily Fluvio Tip</h3>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          
          <p className="mt-2 text-gray-600 text-sm">{tip}</p>
        </div>
      </div>
    </Card>
  );
};

export default DailyTip;