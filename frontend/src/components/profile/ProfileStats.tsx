import React from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/Progress';
import Avatar from '../common/Avatar';
import { Award, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  user: {
    name: string;
    avatar: string;
    level: number;
    levelTitle: string;
    xp: number;
    maxXp: number;
    completedLessons: number;
    totalLessons: number;
    joinDate: string;
    streak: number;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
  const stats = [
    {
      label: 'Completed Lessons',
      value: `${user.completedLessons}/${user.totalLessons}`,
      icon: <BookOpen size={20} className="text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      label: 'Current Level',
      value: `Level ${user.level}`,
      icon: <Award size={20} className="text-green-600" />,
      color: 'bg-green-100',
    },
    {
      label: 'Daily Streak',
      value: `${user.streak} days`,
      icon: <TrendingUp size={20} className="text-orange-600" />,
      color: 'bg-orange-100',
    },
    {
      label: 'Joined',
      value: user.joinDate,
      icon: <CheckCircle size={20} className="text-purple-600" />,
      color: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <Avatar src={user.avatar} size="xl" className="mb-4 sm:mb-0 sm:mr-6" />
          
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-blue-600 font-medium">{user.levelTitle}</p>
            
            <div className="mt-4">
              <ProgressBar
                value={user.xp}
                max={user.maxXp}
                label="XP Progress"
                variant="primary"
                size="md"
              />
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${stat.color}`}>
                {stat.icon}
              </div>
              
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg font-medium text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;