import React from 'react';
import Button from '../components/common/Button';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted, onLogin }) => {
  const features = [
    {
      icon: <BookOpen size={24} className="text-blue-600" />,
      title: 'Interactive Lessons',
      description: 'Learn financial concepts through engaging interactive content tailored to your level.',
    },
    {
      icon: <Award size={24} className="text-green-600" />,
      title: 'Earn Rewards',
      description: 'Collect EduCoins and XP as you complete lessons and quizzes to track your progress.',
    },
    {
      icon: <TrendingUp size={24} className="text-purple-600" />,
      title: 'Track Progress',
      description: 'See your financial knowledge grow with detailed progress tracking and insights.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600 flex items-center">
              EduFinance <span className="ml-2">🪙</span>
            </h1>
          </div>
          
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mr-3"
              onClick={onLogin}
            >
              Log In
            </Button>
            <Button
              size="sm"
              onClick={onGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              EduFinance 🪙
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Master money the fun way. Learn. Quiz. Earn coins.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-blue-700"
                onClick={onLogin}
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Learn With EduFinance?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our gamified platform makes learning personal finance enjoyable and rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
              >
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Join thousands of users who have improved their financial literacy with EduFinance.
            </p>
            <Button
              size="lg"
              onClick={onGetStarted}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold flex items-center">
                EduFinance <span className="ml-2">🪙</span>
              </h2>
              <p className="mt-2 text-gray-400">
                © 2025 EduFinance. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;