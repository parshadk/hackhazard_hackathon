import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronLeft, CheckCircle, AlertCircle, Sparkles, Trophy, Award, BarChart2 } from "lucide-react"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import toast from "react-hot-toast"
import { API_URL } from "../utils/api"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  xpEarned: number
  coinsEarned: number
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [quizSubmitting, setQuizSubmitting] = useState(false)
  const [isOptionSelected, setIsOptionSelected] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.post(`${API_URL}/quiz`)
        const data = res.data as {quiz: Question[]}
      
        setQuestions(data.quiz)
        setAnswers(new Array(data.quiz.length).fill(null))
      } catch (error) {
        console.error("Failed to fetch quiz", error)
        const mockQuestions: Question[] = [
          { id: "1", text: "What is compound interest?", options: [ "Interest on principal", "Interest on principal+interest", "Fixed rate", "Paid at loan end" ], correctAnswer: 1 },
          { id: "2", text: "Which of the following is NOT a type of investment?", options: ["Stocks", "Bonds", "Credit Score", "Real Estate"], correctAnswer: 2 },
          { id: "3", text: "What is diversification in investing?", options: ["One stock", "Spread across assets", "Only bonds", "Switch often"], correctAnswer: 1 },
          { id: "4", text: "What is a 401(k)?", options: ["A tax", "Employer retirement plan", "Loan program", "Health insurance"], correctAnswer: 1 },
          { id: "5", text: "What does APR stand for?", options: ["Annual Percentage Rate", "Approved Payment Return", "Annual Principal Return", "Adjusted Payment Rate"], correctAnswer: 0 },
          { id: "6", text: "What is a mutual fund?", options: ["A single stock", "A pool of stocks/bonds", "Government bond", "High‑risk derivative"], correctAnswer: 1 },
          { id: "7", text: "What is liquidity?", options: ["Ease of converting to cash", "Investment return", "Credit availability", "Debt level"], correctAnswer: 0 },
          { id: "8", text: "What is a budget?", options: ["Track income/expenses", "Only save money", "Borrow funds", "Calculate taxes"], correctAnswer: 0 },
          { id: "9", text: "What is an ETF?", options: ["Exchange-Traded Fund", "Electronic Transfer Form", "Equity Trade Fee", "Earnings Tax Fund"], correctAnswer: 0 },
          { id: "10", text: "What is the time value of money?", options: ["Money's present vs future value", "Fixed interest rate", "Loan term", "Tax benefit"], correctAnswer: 0 },
        ]
        const shuffled = mockQuestions
          .map(q => ({ q, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ q }) => q)
        const randomFive = shuffled.slice(0, 5)
        setQuestions(randomFive)
        setAnswers(new Array(randomFive.length).fill(null))
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
    setIsOptionSelected(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(answers[currentQuestion + 1])
      setIsOptionSelected(answers[currentQuestion + 1] !== null)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[currentQuestion - 1])
      setIsOptionSelected(answers[currentQuestion - 1] !== null)
    }
  }

  const handleSubmit = async () => {
    if (answers.some((answer) => answer === null)) {
      toast.error("Please answer all questions before submitting")
      return
    }

    setQuizSubmitting(true)

    try {
      let correctCount = 0
      questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) correctCount++
      })

      const score = Math.round((correctCount / questions.length) * 100)
      const xpEarned = correctCount * 10
      const coinsEarned = correctCount * 5

      setQuizResult({
        score,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        xpEarned,
        coinsEarned,
      })

      setShowResult(true)
    } catch (error) {
      console.error("Failed to submit quiz", error)
      toast.error("Failed to submit quiz")
    } finally {
      setQuizSubmitting(false)
    }
  }

  const handleFinish = () => {
    navigate("/dashboard")
  }

  if (loading) return <LoadingSpinner />

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No quiz available</h2>
        <Link to={`/lesson/${id}`} className="text-indigo-600 hover:underline">
          Back to lesson
        </Link>
      </div>
    )
  }

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Link to={`/lesson/${id}`} className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-indigo-100"
        >
          <div className="p-6 text-center">
            {quizResult?.score >= 70 ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative inline-block">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring" }}
              >
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              </motion.div>
            )}

            <h2 className="text-2xl font-bold mb-2">
              {quizResult?.score >= 70 ? "Congratulations!" : "Good effort!"}
            </h2>

            <p className="text-gray-600 mb-6">
              {quizResult?.score >= 70
                ? "You've demonstrated excellent understanding of the material!"
                : "Review the material and try again to improve your score."}
            </p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="h-5 w-5 text-indigo-600" />
                  <div className="text-3xl font-bold text-indigo-600">{quizResult?.score}%</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">Score</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center space-x-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <div className="text-3xl font-bold text-indigo-600">+{quizResult?.xpEarned}</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">XP Earned</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center space-x-2">
                  <BarChart2 className="h-5 w-5 text-indigo-600" />
                  <div className="text-3xl font-bold text-indigo-600">+{quizResult?.coinsEarned}</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">Coins Earned</div>
              </div>
            </motion.div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Question Summary</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">{quizResult?.correctAnswers} Correct</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">
                    {quizResult ? quizResult.totalQuestions - quizResult.correctAnswers : 0} Incorrect
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFinish}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Link to={`/lesson/${id}`} className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Unlimited Knowledge Challenge
          </h1>
          <p className="text-sm text-gray-500">Test your knowledge, earn rewards, and grow smarter!</p>
        </div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="h-2 bg-gray-200 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          ></motion.div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </div>
          </div>

          <motion.h2 
            key={currentQuestion}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-medium mb-6"
          >
            {questions[currentQuestion].text}
          </motion.h2>

          <div className="space-y-3 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleOptionSelect(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedOption === index 
                    ? "bg-indigo-50 border-indigo-600 shadow-md" 
                    : "border-gray-300 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      selectedOption === index ? "border-indigo-600 bg-indigo-100" : "border-gray-300"
                    }`}
                  >
                    {selectedOption === index && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-indigo-600"
                      />
                    )}
                  </div>
                  <div className="ml-3">{option}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </motion.button>

            {currentQuestion < questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={selectedOption === null}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={quizSubmitting || answers.some((answer) => answer === null)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {quizSubmitting ? (
                  <span className="flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                      </svg>
                    </motion.span>
                    Submitting...
                  </span>
                ) : "Submit Quiz"}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>The stock market — where fortunes rise, fall, and dreams trade hands with every tick! 💸📈</p>
      </div>
    </motion.div>
  )
}