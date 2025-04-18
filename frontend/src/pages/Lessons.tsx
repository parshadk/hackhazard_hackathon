import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import LessonCard from '../components/lessons/LessonCard';
import LessonFilter from '../components/lessons/LessonFilter';

interface LessonsProps {
  onStartLesson: (id: string) => void;
}

const Lessons: React.FC<LessonsProps> = ({ onStartLesson }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock data for lessons
  const allLessons = [
    {
      id: '1',
      title: 'Understanding Credit Scores',
      topic: 'Credit Management',
      level: 'beginner' as const,
      description: 'Learn how credit scores work, what factors affect them, and how to improve your score over time.',
      timeToComplete: '15 min',
      xpReward: 100,
      coinReward: 50,
      isCompleted: true,
    },
    {
      id: '2',
      title: 'Investment Basics: Stocks & Bonds',
      topic: 'Investing',
      level: 'intermediate' as const,
      description: 'Understand the difference between stocks and bonds, and learn the basics of how the stock market works.',
      timeToComplete: '20 min',
      xpReward: 150,
      coinReward: 75,
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Budgeting 101',
      topic: 'Budgeting',
      level: 'beginner' as const,
      description: 'Learn how to create and maintain a personal budget to help manage your finances effectively.',
      timeToComplete: '10 min',
      xpReward: 80,
      coinReward: 40,
      isCompleted: true,
    },
    {
      id: '4',
      title: 'Tax-Advantaged Accounts',
      topic: 'Taxes',
      level: 'intermediate' as const,
      description: 'Explore different types of tax-advantaged accounts like 401(k)s and IRAs, and how to use them for retirement savings.',
      timeToComplete: '25 min',
      xpReward: 200,
      coinReward: 100,
      isCompleted: false,
    },
    {
      id: '5',
      title: 'Understanding Mortgages',
      topic: 'Home Buying',
      level: 'intermediate' as const,
      description: 'Learn about different types of mortgages, interest rates, and the home buying process.',
      timeToComplete: '30 min',
      xpReward: 250,
      coinReward: 125,
      isCompleted: false,
    },
    {
      id: '6',
      title: 'Advanced Investment Strategies',
      topic: 'Investing',
      level: 'advanced' as const,
      description: 'Explore more complex investment strategies including diversification, asset allocation, and risk management.',
      timeToComplete: '35 min',
      xpReward: 300,
      coinReward: 150,
      isCompleted: false,
    },
  ];
  
  // Filter lessons based on active filter
  const filteredLessons = allLessons.filter((lesson) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return lesson.isCompleted;
    return lesson.level === activeFilter;
  });

  return (
    <PageContainer
      title="Lessons"
      description="Browse our collection of finance lessons"
    >
      <LessonFilter 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onStartLesson={onStartLesson}
          />
        ))}
      </div>
      
      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No lessons found for this filter</p>
          <button 
            onClick={() => setActiveFilter('all')}
            className="mt-4 text-blue-600 font-medium hover:text-blue-800"
          >
            View all lessons
          </button>
        </div>
      )}
    </PageContainer>
  );
};

export default Lessons;