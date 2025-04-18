import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { BookOpen, Clock } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    topic: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    description: string;
    timeToComplete: string;
    xpReward: number;
    coinReward: number;
    isCompleted: boolean;
  };
  onStartLesson: (id: string) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStartLesson }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start">
          <div className="bg-blue-100 p-2 rounded-full">
            <BookOpen className="text-blue-600" size={18} />
          </div>
          <Badge variant={lesson.level}>
            {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
          </Badge>
        </div>
        
        <h3 className="mt-3 text-lg font-medium text-gray-900">{lesson.title}</h3>
        <p className="mt-1 text-sm font-medium text-blue-600">{lesson.topic}</p>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
        
        <div className="flex items-center mt-3 text-sm text-gray-500">
          <Clock size={16} className="mr-1" />
          <span>{lesson.timeToComplete}</span>
        </div>
      </div>
      
      <div className="p-5 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
              <span className="text-blue-700 text-xs font-medium">+{lesson.xpReward} XP</span>
            </div>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
              <span className="text-yellow-700 text-xs font-medium">+{lesson.coinReward}</span>
              <span className="ml-1">🪙</span>
            </div>
          </div>
          
          {lesson.isCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          )}
        </div>
        
        <Button
          variant={lesson.isCompleted ? 'outline' : 'primary'}
          className="w-full"
          onClick={() => onStartLesson(lesson.id)}
        >
          {lesson.isCompleted ? 'Review Lesson' : 'Start Lesson'}
        </Button>
      </div>
    </Card>
  );
};

export default LessonCard;