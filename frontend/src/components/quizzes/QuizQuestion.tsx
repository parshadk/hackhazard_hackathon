import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  };
  onAnswer: (questionId: string, optionId: string, isCorrect: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  onNext,
  isLast,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOptionId(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionId) {
      const isCorrect = selectedOptionId === question.correctOptionId;
      onAnswer(question.id, selectedOptionId, isCorrect);
      setIsSubmitted(true);
    }
  };

  return (
    <Card className="p-5">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
      
      <div className="space-y-3 mb-5">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;
          
          let optionClassName = "flex items-center p-3 border rounded-lg cursor-pointer transition-colors";
          
          if (!isSubmitted) {
            optionClassName += isSelected
              ? " border-blue-500 bg-blue-50"
              : " border-gray-200 hover:border-gray-300";
          } else {
            if (isSelected) {
              optionClassName += isCorrect
                ? " border-green-500 bg-green-50"
                : " border-red-500 bg-red-50";
            } else if (isCorrect) {
              optionClassName += " border-green-500 bg-green-50";
            } else {
              optionClassName += " border-gray-200 opacity-60";
            }
          }
          
          return (
            <div
              key={option.id}
              className={optionClassName}
              onClick={() => handleSelectOption(option.id)}
            >
              <div className="flex-1">
                <p className="text-gray-800">{option.text}</p>
              </div>
              
              {isSubmitted && (
                <div className="ml-3">
                  {isCorrect ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    isSelected && <XCircle size={20} className="text-red-600" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={onNext}
            variant={isLast ? 'secondary' : 'primary'}
          >
            {isLast ? 'Finish Quiz' : 'Next Question'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizQuestion;