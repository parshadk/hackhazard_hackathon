import React from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/Progress';
import { Award } from 'lucide-react';

interface LevelIndicatorProps {
  level: number;
  title: string;
  currentXp: number;
  requiredXp: number;
  nextLevel: string;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  level,
  title,
  currentXp,
  requiredXp,
  nextLevel,
}) => {
  return (
    <Card className="p-5">
      <div className="flex items-center">
        <div className="bg-blue-100 p-2 rounded-full mr-4">
          <Award className="text-blue-600" size={20} />
        </div>
        
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900">Level {level}</h3>
            <span className="ml-2 text-sm font-medium text-blue-600">{title}</span>
          </div>
          
          <div className="mt-2">
            <ProgressBar
              value={currentXp}
              max={requiredXp}
              variant="primary"
              size="sm"
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            {requiredXp - currentXp} XP needed for {nextLevel}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LevelIndicator;