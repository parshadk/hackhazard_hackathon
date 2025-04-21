import { Link } from "react-router-dom"
import { Award, BookOpen, DollarSign, TrendingUp } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Award className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-indigo-700">EduFinance</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 text-slate-900">
            Master Financial Literacy with <span className="text-indigo-600">EduFinance</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Learn essential financial skills, track your progress, and build a secure financial future through
            interactive lessons and quizzes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-all shadow"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-md text-lg font-medium hover:bg-slate-100 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Why Choose EduFinance?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Interactive Lessons</h3>
            <p className="text-slate-600">
              Engage with our comprehensive curriculum designed to make financial concepts easy to understand.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Virtual Wallet</h3>
            <p className="text-slate-600">
              Practice managing finances with our virtual wallet system. Earn coins by completing lessons and quizzes.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Live Market Updates</h3>
            <p className="text-slate-600">
              Stay informed with real-time market data and learn how to analyze financial trends.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Financial Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are improving their financial literacy and building a better future.
          </p>
          <Link
            to="/register"
            className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-slate-100 transition-colors shadow"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Award className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold text-white">EduFinance</span>
            </div>
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} EduFinance. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
