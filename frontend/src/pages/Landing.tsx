import { Link } from "react-router-dom";
import { Award, BookOpen, DollarSign, TrendingUp, BarChart2, Clock, Trophy, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 flex flex-col">
      {/* Header with subtle animation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-all duration-300 hover:shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 group">
            <img src="/white.png" alt="EduFinance Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-800 transition-colors">
              EduFinance
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/login" 
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors hover:-translate-y-0.5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-all shadow hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main content with flex-grow to push footer down */}
      <main className="flex-grow">
        {/* Hero Section with gradient text */}
        <section className="container mx-auto px-6 py-24 md:py-38 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-900">
              Master Financial Literacy with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">EduFinance</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              An interactive platform to learn essential financial skills, test your knowledge with real-life quizzes, 
              and build a secure financial future through engaging lessons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-all shadow hover:shadow-lg hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features with enhanced cards */}
        <section className="container mx-auto px-6 py-20 md:py-25">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose EduFinance?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform combines education with practical application to help you master personal finance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Enhanced with badge */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:border-indigo-100 relative overflow-hidden group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform mx-auto">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-800 text-center">Interactive Lessons</h3>
              <p className="text-slate-600 mb-6 text-center">
                Engaging modules that simplify complex financial concepts with real-world examples and interactive exercises.
              </p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-500 mr-2" /> Personal Finance</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-500 mr-2" /> Investment Basics</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-500 mr-2" /> Retirement Planning</li>
              </ul>
            </div>

            {/* Feature 2 - Quizzes with animated trophy */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:border-indigo-100 group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform mx-auto">
                <Trophy className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-800 text-center">Market Challenge Quizzes</h3>
              <p className="text-slate-600 mb-6 text-center">
                Test your knowledge with our stock market quizzes that simulate real trading scenarios and financial decisions.
              </p>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-start text-sm text-indigo-800 mb-3">
                  <BarChart2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlimited practice with dynamic challenges</span>
                </div>
                <div className="flex items-start text-sm text-indigo-800">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Boost your finance skills with unlimited, interactive questions.</span>
                </div>
              </div>
            </div>

            {/* Feature 3 - With progress visualization */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:border-indigo-100 group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform mx-auto">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-800 text-center">Live Market Updates</h3>
              <p className="text-slate-600 mb-6 text-center">
                Practice with real-time market data and learn to analyze financial trends with our interactive dashboards.
              </p>
              <div className="mt-4">
                {/* Placeholder for any additional content */}
              </div>
            </div>
          </div>
        </section>

        {/* Compact CTA with gradient background */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 md:py-10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-2xl font-bold mb-4">Start Your Financial Journey Today</h2>
            <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto opacity-90 leading-snug">
              Join our community and take control of your financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg text-base font-semibold hover:bg-slate-100 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign Up Free
              </Link>

            </div>
            <p className="mt-4 text-indigo-200 text-xs">No credit card required</p>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0 group">
              <img 
                src="/black.png" 
                alt="EduFinance Logo" 
                className="h-8 w-8 transition-transform group-hover:animate-spin" 
              />
              <span className="text-lg font-bold text-white">EduFinance</span>
            </div>
            <div className="w-full flex justify-center mb-6 md:mb-0">
  <div className="flex flex-wrap justify-center gap-8">
    <a href="mailto:hackhazardlearning@gmail.com" className="text-slate-400 hover:text-white transition-colors">Contact</a>
    <a href="https://github.com/Gauravk100" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">About</a>
  </div>
</div>
            <div className="text-slate-400 text-sm text-center md:text-right">
              © {new Date().getFullYear()} EduFinance. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}