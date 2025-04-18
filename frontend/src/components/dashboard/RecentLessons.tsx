import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Clock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completionPercentage: number;
  timeToComplete: string;
}

interface RecentLessonsProps {
  lessons: Lesson[];
  onViewLesson: (id: string) => void;
}

const RecentLessons: React.FC<RecentLessonsProps> = ({ lessons, onViewLesson }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Lessons</h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
          View All
        </button>
      </div>
      
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className="p-4 hover:border-blue-200"
            onClick={() => onViewLesson(lesson.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{lesson.topic}</p>
                
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>{lesson.timeToComplete}</span>
                </div>
              </div>
              
              <Badge variant={lesson.level}>
                {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
              </Badge>
            </div>
            
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${lesson.completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {lesson.completionPercentage}% complete
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentLessons;