import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { ArrowLeft, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface LessonDetailProps {
  lessonId: string;
  onBack: () => void;
  onStartQuiz: (lessonId: string) => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ 
  lessonId, 
  onBack, 
  onStartQuiz 
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Mock lesson data
  const lesson = {
    id: lessonId,
    title: 'Understanding Credit Scores',
    topic: 'Credit Management',
    level: 'beginner' as const,
    timeToComplete: '15 min',
    xpReward: 100,
    coinReward: 50,
    content: `
      <h2>What is a Credit Score?</h2>
      <p>A credit score is a three-digit number that represents your creditworthiness. It helps lenders assess the risk of lending you money or giving you credit.</p>
      
      <h2>Why are Credit Scores Important?</h2>
      <p>Credit scores affect your ability to:</p>
      <ul>
        <li>Get approved for loans and credit cards</li>
        <li>Secure favorable interest rates</li>
        <li>Rent an apartment</li>
        <li>In some cases, get hired for certain jobs</li>
      </ul>
      
      <h2>What Factors Affect Your Credit Score?</h2>
      <p>The major factors that determine your credit score include:</p>
      <ul>
        <li><strong>Payment History (35%)</strong>: Whether you've paid your bills on time</li>
        <li><strong>Credit Utilization (30%)</strong>: How much of your available credit you're using</li>
        <li><strong>Length of Credit History (15%)</strong>: How long you've had credit accounts</li>
        <li><strong>Credit Mix (10%)</strong>: The variety of credit accounts you have</li>
        <li><strong>New Credit (10%)</strong>: How many new accounts you've opened recently</li>
      </ul>
      
      <h2>How to Improve Your Credit Score</h2>
      <ol>
        <li>Pay your bills on time, every time</li>
        <li>Keep your credit card balances low (below 30% of your limit)</li>
        <li>Don't close old credit accounts</li>
        <li>Be careful about opening too many new accounts at once</li>
        <li>Regularly check your credit report for errors</li>
      </ol>
    `,
  };

  const handleToggleCompletion = () => {
    setIsCompleted(!isCompleted);
  };

  const handleQuiz = () => {
    onStartQuiz(lessonId);
  };

  return (
    <PageContainer>
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 font-medium mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Lessons
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-blue-600 font-medium mt-1">{lesson.topic}</p>
              </div>
              
              <Badge variant={lesson.level}>
                {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Clock size={16} className="mr-1" />
              <span>{lesson.timeToComplete}</span>
            </div>
            
            <div 
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
              <Button 
                variant="primary"
                onClick={handleQuiz}
              >
                Take Quiz
              </Button>
              
              <div className="flex items-center">
                <span className="mr-2 text-gray-700">Mark Completed:</span>
                <button
                  onClick={handleToggleCompletion}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    isCompleted ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300`} />
                </button>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-5 sticky top-24">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <BookOpen size={18} className="text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Lesson Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Lesson Status</p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                  <p className="font-medium text-gray-900">
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">Rewards</p>
                <div className="flex space-x-3 mt-2">
                  <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded">
                    <span className="text-blue-700 font-medium">+{lesson.xpReward} XP</span>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded">
                    <span className="text-yellow-700 font-medium">+{lesson.coinReward}</span>
                    <span className="ml-1">🪙</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">What You'll Learn</p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">What credit scores are and why they matter</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">Factors that impact your credit score</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">How to improve your credit score</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">Common credit score myths</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default LessonDetail;