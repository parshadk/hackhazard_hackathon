import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import QuizQuestion from '../components/quizzes/QuizQuestion';
import QuizAssist from '../components/quizzes/QuizAssist';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ArrowLeft } from 'lucide-react';

interface QuizProps {
  quizId: string;
  onBack: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ quizId, onBack, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
  }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mock quiz data
  const quiz = {
    id: quizId,
    title: 'Credit Score Fundamentals',
    topic: 'Credit Management',
    level: 'beginner' as const,
    questions: [
      {
        id: 'q1',
        text: 'What is the most important factor that affects your credit score?',
        options: [
          { id: 'a1', text: 'Payment history' },
          { id: 'a2', text: 'Credit utilization' },
          { id: 'a3', text: 'Length of credit history' },
          { id: 'a4', text: 'Types of credit' },
        ],
        correctOptionId: 'a1',
      },
      {
        id: 'q2',
        text: 'What percentage of your credit score is determined by your payment history?',
        options: [
          { id: 'a1', text: '15%' },
          { id: 'a2', text: '25%' },
          { id: 'a3', text: '35%' },
          { id: 'a4', text: '45%' },
        ],
        correctOptionId: 'a3',
      },
      {
        id: 'q3',
        text: 'What is considered a good credit score in the FICO model?',
        options: [
          { id: 'a1', text: '500-579' },
          { id: 'a2', text: '580-669' },
          { id: 'a3', text: '670-739' },
          { id: 'a4', text: '740-799' },
        ],
        correctOptionId: 'a3',
      },
      {
        id: 'q4',
        text: 'What is credit utilization?',
        options: [
          { id: 'a1', text: 'How many credit cards you have' },
          { id: 'a2', text: 'How much of your available credit you are using' },
          { id: 'a3', text: 'How often you check your credit score' },
          { id: 'a4', text: 'How long you have had credit' },
        ],
        correctOptionId: 'a2',
      },
      {
        id: 'q5',
        text: 'What is generally recommended for your credit utilization ratio?',
        options: [
          { id: 'a1', text: 'Keep it below 30%' },
          { id: 'a2', text: 'Keep it exactly at 50%' },
          { id: 'a3', text: 'Keep it as high as possible' },
          { id: 'a4', text: 'Use all available credit to show you can handle it' },
        ],
        correctOptionId: 'a1',
      },
    ],
  };

  const handleAnswer = (questionId: string, optionId: string, isCorrect: boolean) => {
    setUserAnswers([
      ...userAnswers,
      { questionId, selectedOptionId: optionId, isCorrect },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      
      const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
      onComplete(correctAnswers, quiz.questions.length);
    }
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    return {
      score: correctAnswers,
      total: quiz.questions.length,
      percentage: Math.round((correctAnswers / quiz.questions.length) * 100),
    };
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <PageContainer>
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 font-medium mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="text-gray-600 mt-1">
          {currentQuestionIndex + 1} of {quiz.questions.length} questions
        </p>
      </div>
      
      {!quizCompleted ? (
        <>
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            isLast={currentQuestionIndex === quiz.questions.length - 1}
          />
          
          <QuizAssist topic={quiz.topic} />
        </>
      ) : (
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Quiz Completed!
          </h2>
          
          <div className="my-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100">
              <div className="text-center">
                <span className="block text-3xl font-bold text-blue-600">
                  {calculateScore().percentage}%
                </span>
                <span className="text-sm text-blue-800">
                  {calculateScore().score}/{calculateScore().total}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            {calculateScore().percentage >= 80
              ? 'Great job! You have a solid understanding of this topic.'
              : calculateScore().percentage >= 60
              ? 'Good effort! Keep learning to master this topic.'
              : 'Keep practicing! Review the lessons and try again.'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
            >
              Back to Lessons
            </Button>
            <Button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setQuizCompleted(false);
              }}
            >
              Retry Quiz
            </Button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default Quiz;