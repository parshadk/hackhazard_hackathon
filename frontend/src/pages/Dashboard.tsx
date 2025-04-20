import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import RecentLessons from '../components/dashboard/RecentLessons';
import DailyTip from '../components/dashboard/DailyTip';
import RecommendedQuiz from '../components/dashboard/RecommendedQuiz';
import LevelIndicator from '../components/dashboard/LevelIndicator';
import API from "./../utils/api";

interface DashboardProps {
  onViewLesson: (id: string) => void; 
  onStartQuiz: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewLesson, onStartQuiz }) => {
  // Mock data for dashboard components
  const recentLessons = [
    {
      id: '1',
      title: 'Understanding Credit Scores',
      topic: 'Credit Management',
      level: 'beginner' as const,
      completionPercentage: 75,
      timeToComplete: '15 min',
    },
    {
      id: '2',
      title: 'Investment Basics: Stocks & Bonds',
      topic: 'Investing',
      level: 'intermediate' as const,
      completionPercentage: 30,
      timeToComplete: '20 min',
    },
    {
      id: '3',
      title: 'Budgeting 101',
      topic: 'Budgeting',
      level: 'beginner' as const,
      completionPercentage: 100,
      timeToComplete: '10 min',
    },
  ];

  const dailyTip = {
    tip: "When paying off debts, consider the 'avalanche method' - focus on high-interest debts first while making minimum payments on others.",
    date: 'May 15, 2025',
  };

  const recommendedQuiz = {
    id: '1',
    title: 'Credit Score Fundamentals',
    topic: 'Credit Management',
    level: 'beginner' as const,
    questionCount: 5,
    timeToComplete: '10 min',
    xpReward: 100,
    coinReward: 50,
  };

  const levelInfo = {
    level: 3,
    title: 'Finance Explorer',
    currentXp: 350,
    requiredXp: 500,
    nextLevel: 'Finance Scholar',
  };

  return (
    <PageContainer title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentLessons 
            lessons={recentLessons} 
            onViewLesson={onViewLesson} 
          />
          
          <DailyTip 
            tip={dailyTip.tip} 
            date={dailyTip.date} 
          />
        </div>
        
        <div className="space-y-6">
          <RecommendedQuiz 
            quiz={recommendedQuiz} 
            onStartQuiz={onStartQuiz} 
          />
          
          <LevelIndicator 
            level={levelInfo.level}
            title={levelInfo.title}
            currentXp={levelInfo.currentXp}
            requiredXp={levelInfo.requiredXp}
            nextLevel={levelInfo.nextLevel}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;