import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { CheckCircle, Clock } from 'lucide-react';

interface RecommendedQuizProps {
  quiz: {
    id: string;
    title: string;
    topic: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    questionCount: number;
    timeToComplete: string;
    xpReward: number;
    coinReward: number;
  };
  onStartQuiz: (id: string) => void;
}

const RecommendedQuiz: React.FC<RecommendedQuizProps> = ({ quiz, onStartQuiz }) => {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900">Recommended Quiz</h3>
        <Badge variant={quiz.level}>
          {quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
        </Badge>
      </div>
      
      <h4 className="text-lg font-medium text-gray-800 mt-3">{quiz.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{quiz.topic}</p>
      
      <div className="flex items-center mt-4 text-sm text-gray-500">
        <div className="flex items-center mr-4">
          <CheckCircle size={16} className="mr-1" />
          <span>{quiz.questionCount} questions</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="mr-1" />
          <span>{quiz.timeToComplete}</span>
        </div>
      </div>
      
      <div className="mt-5 flex justify-between items-center">
        <div className="flex space-x-3">
          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
            <span className="text-blue-700 text-sm font-medium">+{quiz.xpReward} XP</span>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <span className="text-yellow-700 text-sm font-medium">+{quiz.coinReward}</span>
            <span className="ml-1">🪙</span>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => onStartQuiz(quiz.id)}
        >
          Start Quiz
        </Button>
      </div>
    </Card>
  );
};

export default RecommendedQuiz;