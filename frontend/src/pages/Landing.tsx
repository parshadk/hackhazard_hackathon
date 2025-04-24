import { Link } from "react-router-dom";
import { Award, BookOpen, DollarSign, TrendingUp, BarChart2, Clock, Trophy, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* Header with subtle animation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-all duration-300 hover:shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 group">
            <Award className="h-8 w-8 text-indigo-600 group-hover:rotate-12 transition-transform" />
            <h1 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-800 transition-colors">
              EduFinance
            </h1>
          </div>
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors hover:-translate-y-0.5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all shadow hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with gradient text */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 text-slate-900">
            Master Financial Literacy with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">EduFinance</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Your interactive platform to learn essential financial skills, test your knowledge with real-world quizzes, 
            and build a secure financial future through engaging lessons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-all shadow hover:shadow-lg hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-md text-lg font-medium hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features with enhanced cards */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Why Choose EduFinance?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 - Enhanced with badge */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:border-indigo-100 relative overflow-hidden group">
            <div className="absolute -top-3 -right-3 bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
              New
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Interactive Lessons</h3>
            <p className="text-slate-600 mb-4">
              Engaging modules that simplify complex financial concepts with real-world examples and interactive exercises.
            </p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-500 mr-2" /> Personal Finance</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-500 mr-2" /> Investment Basics</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-500 mr-2" /> Retirement Planning</li>
            </ul>
          </div>

          {/* Feature 2 - Quizzes with animated trophy */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:border-indigo-100 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <Trophy className="h-6 w-6 text-indigo-600 animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Market Challenge Quizzes</h3>
            <p className="text-slate-600 mb-4">
              Test your knowledge with our stock market quizzes that simulate real trading scenarios and financial decisions.
            </p>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <div className="flex items-center text-sm text-indigo-800">
                <BarChart2 className="h-4 w-4 mr-2" />
                <span>Unlimited practice with dynamic challenges</span>
              </div>
              <div className="flex items-center text-sm text-indigo-800 mt-2">
                <Clock className="h-4 w-4 mr-2" />
                <span>Boost your finance skills with unlimited, interactive questions.</span>
              </div>
            </div>
          </div>

          {/* Feature 3 - With progress visualization */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 hover:border-indigo-100 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Live Market Updates</h3>
            <p className="text-slate-600 mb-4">
              Practice with real-time market data and learn to analyze financial trends with our interactive dashboards.
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Your Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA with gradient background */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Financial Journey Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of learners and take control of your financial future with interactive lessons and real-world challenges.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Sign Up Free
          </Link>
          <p className="mt-4 text-indigo-200 text-sm">No credit card required</p>
        </div>
      </section>

      {/* Footer with subtle gradient */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0 group">
              <Award className="h-6 w-6 text-indigo-400 group-hover:animate-spin transition-transform" />
              <span className="text-lg font-bold text-white">EduFinance</span>
            </div>
            <div className="flex space-x-6 mb-6 md:mb-0">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} EduFinance. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}