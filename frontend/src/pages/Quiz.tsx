import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ChevronLeft, CheckCircle, AlertCircle } from "lucide-react"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import toast from "react-hot-toast"
import { API_URL } from "../utils/api"
import axios from "axios"
import { set } from "date-fns"
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
          { id: "10", text: "What is the time value of money?", options: ["Money’s present vs future value", "Fixed interest rate", "Loan term", "Tax benefit"], correctAnswer: 0 },
          { id: "11", text: "What is a credit score?", options: ["Numerical creditworthiness", "Loan amount", "Interest rate", "Tax bracket"], correctAnswer: 0 },
          { id: "12", text: "What is a debit card?", options: ["Borrows money", "Linked to checking", "Pays interest", "Credit line"], correctAnswer: 1 },
          { id: "13", text: "What is inflation?", options: ["Price decrease", "Price increase", "No impact", "Only for investors"], correctAnswer: 1 },
          { id: "14", text: "What is a Roth IRA?", options: ["Tax-free withdrawals", "Tax-deferred withdrawals", "Taxed withdrawals", "Self-employed only"], correctAnswer: 0 },
          { id: "15", text: "What is penalty APR?", options: ["Reduced rate", "Higher rate after default", "Fixed rate", "Introductory rate"], correctAnswer: 1 },
          { id: "16", text: "What is principal on a loan?", options: ["Total interest paid", "Original amount borrowed", "Monthly fee", "Credit limit"], correctAnswer: 1 },
          { id: "17", text: "What is default risk?", options: ["Price volatility", "Borrower failure to pay", "Liquidity issue", "Tax penalty"], correctAnswer: 1 },
          { id: "18", text: "What is a dividend?", options: ["Company profit share", "Loan interest", "Tax fee", "Stock split"], correctAnswer: 0 },
          { id: "19", text: "What is an index fund?", options: ["Actively managed fund", "Tracks a market index", "High‑risk hedge fund", "Government bond"], correctAnswer: 1 },
          { id: "20", text: "What is credit utilization?", options: ["Debt-to-income ratio", "Used credit vs limit", "Annual fee", "Credit score"], correctAnswer: 1 },
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
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(answers[currentQuestion + 1])
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[currentQuestion - 1])
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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <Link to={`/lesson/${id}`} className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 text-center">
            {quizResult?.score >= 70 ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            )}

            <h2 className="text-2xl font-bold mb-2">
              {quizResult?.score >= 70 ? "Congratulations!" : "Good effort!"}
            </h2>

            <p className="text-gray-600 mb-6">
              {quizResult?.score >= 70
                ? "You've successfully completed the quiz."
                : "You've completed the quiz, but might want to review the material again."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">{quizResult?.score}%</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">+{quizResult?.xpEarned}</div>
                <div className="text-sm text-gray-500">XP Earned</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">+{quizResult?.coinsEarned}</div>
                <div className="text-sm text-gray-500">Coins Earned</div>
              </div>
            </div>

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

            <button
              onClick={handleFinish}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Link to={`/lesson/${id}`} className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Quiz</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-in-out"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <h2 className="text-xl font-medium mb-6">{questions[currentQuestion].text}</h2>

          <div className="space-y-3 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-4 border rounded-md cursor-pointer transition-colors quiz-option ${
                  selectedOption === index ? "bg-indigo-50 border-indigo-600" : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedOption === index ? "border-indigo-600" : "border-gray-300"
                    }`}
                  >
                    {selectedOption === index && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
                  </div>
                  <div className="ml-3">{option}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={quizSubmitting || answers.some((answer) => answer === null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {quizSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
