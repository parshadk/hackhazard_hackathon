import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { MessageCircle, Send } from 'lucide-react';

interface QuizAssistProps {
  topic: string;
}

const QuizAssist: React.FC<QuizAssistProps> = ({ topic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user message
    setMessages([...messages, { text: question, isUser: true }]);
    
    //add groq AI res 
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { 
          text: `Here's some information about ${topic} related to your question: "${question}"...`, 
          isUser: false 
        }
      ]);
      setIsLoading(false);
      setQuestion('');
    }, 1000);
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <MessageCircle size={18} className="text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-900">AI Quiz Assist</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Get Help'}
        </Button>
      </div>
      
      {isOpen && (
        <Card className="p-0 overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <p className="text-sm text-blue-800">
              Ask questions about <span className="font-medium">{topic}</span> and get instant help
            </p>
          </div>
          
          <div className="p-4 max-h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">
                  No messages yet. Ask a question to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-3/4 ${
                      message.isUser
                        ? 'bg-blue-100 text-blue-900 ml-auto'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-gray-100 p-3 rounded-lg inline-block">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this topic..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              className="rounded-l-none"
              disabled={isLoading}
            >
              <Send size={18} />
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default QuizAssist;