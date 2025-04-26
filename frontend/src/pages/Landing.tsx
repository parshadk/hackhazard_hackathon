import { Link } from "react-router-dom";
import { BookOpen, BarChart2, Clock, Trophy, CheckCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Landing() {
  const [typedText, setTypedText] = useState("");
  const phrases = ["Financial Literacy", "Investment Skills", "Market Knowledge", "Wealth Building"];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const typeText = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (!isDeleting) {
        setTypedText(currentPhrase.substring(0, typedText.length + 1));
        if (typedText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setTypedText(currentPhrase.substring(0, typedText.length - 1));
        if (typedText.length === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
          setTypingSpeed(150);
        }
      }
    };

    const timer = setTimeout(typeText, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, currentPhraseIndex, isDeleting, typingSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-slate-800 flex flex-col relative overflow-hidden">
      {/* Enhanced Background with more shapes and gradients */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Large gradient circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-300 to-white rounded-full opacity-20 blur-xl transform -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-400 to-white rounded-full opacity-20 blur-xl transform translate-x-1/3 translate-y-1/3"></div>
        
        {/* Medium shapes */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-tr from-indigo-200 to-white rounded-lg opacity-15 blur-lg rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-bl from-indigo-300 to-white rounded-full opacity-15 blur-lg"></div>
        
        {/* Small decorative elements */}
        <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-indigo-400 rounded-full opacity-10"></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-indigo-300 rounded-lg opacity-10 rotate-45"></div>
        <div className="absolute bottom-1/4 left-3/4 w-20 h-20 bg-indigo-500 rounded-full opacity-10"></div>
        
        {/* Wave patterns */}
        <svg className="absolute bottom-0 left-0 w-full opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgb(79, 70, 229)" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute top-0 right-0 w-full opacity-5 transform rotate-180" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgb(99, 102, 241)" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,96C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      

      {/* Glass header with gradient */}
      <header className="bg-gradient-to-r from-white/80 via-indigo-50/80 to-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/white.png" alt="EduFinance Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-indigo-700">EduFinance</h1>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/login" 
              className="text-slate-700 hover:text-indigo-600 font-medium transition-colors px-3 py-1 rounded-lg hover:bg-white/30"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10">
        {/* Hero Section with gradients */}
        <section className="container mx-auto px-6 py-24 md:py-32 text-center relative">
          {/* Additional decorative elements for hero section */}
          <div className="absolute top-0 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 right-1/5 w-8 h-8 bg-indigo-300 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/4 left-1/6 w-10 h-10 bg-indigo-400 rounded-full opacity-30"></div>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
              Master <span className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-transparent bg-clip-text">{typedText}</span>
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              An interactive platform to learn essential financial skills through engaging lessons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-indigo-600 hover:to-indigo-800 transition-all shadow hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r from-white to-indigo-50 border border-slate-200 text-slate-700 px-8 py-3 rounded-lg text-lg font-medium hover:from-indigo-50 hover:to-white transition-all shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features with gradient cards */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose EduFinance?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform combines education with practical application.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Interactive Lessons */}
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-indigo-200 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 h-full flex flex-col p-8">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800 text-center group-hover:text-indigo-700 transition-colors">
                  Interactive Lessons
                </h3>
                <p className="text-slate-600 mb-6 text-center">
                  Engaging modules that simplify complex financial concepts.
                </p>
                <div className="mt-auto">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 group-hover:border-indigo-200 transition-colors">
                    <ul className="space-y-3 text-sm text-slate-500">
                      <li className="flex items-center group-hover:text-slate-700 transition-colors">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 group-hover:text-indigo-600 transition-colors" />
                        Personal Finance
                      </li>
                      <li className="flex items-center group-hover:text-slate-700 transition-colors">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 group-hover:text-indigo-600 transition-colors" />
                        Investment Basics
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-100 group-hover:bg-indigo-200 transition-colors"></div>
            </div>

            {/* Feature 2 - Market Quizzes */}
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-indigo-200 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 h-full flex flex-col p-8">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800 text-center group-hover:text-indigo-700 transition-colors">
                  Market Quizzes
                </h3>
                <p className="text-slate-600 mb-6 text-center">
                  Test your knowledge with real trading scenarios.
                </p>
                <div className="mt-auto">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 group-hover:border-indigo-200 transition-colors">
                    <ul className="space-y-3 text-sm text-slate-500">
                      <li className="flex items-center group-hover:text-slate-700 transition-colors">
                        <BarChart2 className="h-4 w-4 text-indigo-500 mr-2 group-hover:text-indigo-600 transition-colors" />
                        Unlimited practice
                      </li>
                      <li className="flex items-center group-hover:text-slate-700 transition-colors">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 group-hover:text-indigo-600 transition-colors" />
                        Skill Assessment
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-100 group-hover:bg-indigo-200 transition-colors"></div>
            </div>

            {/* Feature 3 - Market Updates */}
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-indigo-200 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 h-full flex flex-col p-8">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800 text-center group-hover:text-indigo-700 transition-colors">
                  Market Updates
                </h3>
                <p className="text-slate-600 mb-6 text-center">
                  Practice with real-time market data.
                </p>
                <div className="mt-auto">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 group-hover:border-indigo-200 transition-colors">
                    <ul className="space-y-3 text-sm text-slate-500">
                      <li className="flex items-center group-hover:text-slate-700 transition-colors">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 group-hover:text-indigo-600 transition-colors" />
                        Market Trends
                      </li>
                      <li className="flex items-center group-hover:text-slate-700 transition-colors">
                        <CheckCircle className="h-4 w-4 text-indigo-500 mr-2 group-hover:text-indigo-600 transition-colors" />
                        Data Analysis
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-100 group-hover:bg-indigo-200 transition-colors"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with gradient */}
 
<footer className="bg-white/40 backdrop-blur-xl border-t border-white/50 py-12 relative">
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-100"></div>
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <div className="flex items-center space-x-3 justify-center md:justify-start">
        <img src="/black.png" alt="EduFinance Logo" className="h-7 w-7" />
        <span className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-blue-600 text-transparent bg-clip-text">EduFinance</span>
      </div>
      <div className="flex justify-center space-x-8">
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=hackhazardlearning@gmail.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Contact
        </a>
        <Link to="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">
          About Us
        </Link>
      </div>
      <div className="text-slate-500 text-sm text-center md:text-right">
        © {new Date().getFullYear()} EduFinance. All rights reserved.
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}