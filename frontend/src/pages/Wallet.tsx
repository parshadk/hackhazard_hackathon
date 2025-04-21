import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Coins, TrendingUp, Award } from "lucide-react"
import LoadingSpinner from "../components/ui/LoadingSpinner"

interface Transaction {
  id: string
  type: "earn" | "spend"
  amount: number
  description: string
  date: string
}

export default function Wallet() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [coins, setCoins] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // In a real app, you would fetch from your API
    // For demo, we'll create mock data
    const mockCoins = 250
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "earn",
        amount: 50,
        description: "Completed 'Introduction to Finance' quiz",
        date: "2023-06-15T10:30:00Z",
      },
      {
        id: "2",
        type: "earn",
        amount: 25,
        description: "Completed 'Budgeting Basics' lesson",
        date: "2023-06-14T14:45:00Z",
      },
      {
        id: "3",
        type: "earn",
        amount: 100,
        description: "Completed 'Investment Fundamentals' course",
        date: "2023-06-10T09:15:00Z",
      },
      {
        id: "4",
        type: "spend",
        amount: 75,
        description: "Unlocked 'Advanced Stock Trading' course",
        date: "2023-06-05T16:20:00Z",
      },
      {
        id: "5",
        type: "earn",
        amount: 150,
        description: "Completed all quizzes with 90%+ score",
        date: "2023-06-01T11:10:00Z",
      },
    ]

    setCoins(mockCoins)
    setTransactions(mockTransactions)
    setLoading(false)
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">My Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coins card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Coins className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Coins</div>
              <div className="text-3xl font-bold">{coins}</div>
            </div>
          </div>
        </div>

        {/* XP card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total XP</div>
              <div className="text-3xl font-bold">{user?.xp || 0}</div>
            </div>
          </div>
        </div>

        {/* Level card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Current Level</div>
              <div className="text-3xl font-bold">{user?.level || "Beginner"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4 text-gray-800">Progress to Next Level</h2>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{user?.level || "Beginner"}</span>
            <span>
              {user?.level === "Beginner" ? "Intermediate" : user?.level === "Intermediate" ? "Advanced" : "Master"}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, (user?.xp || 0) % 100)}%` }} />
          </div>
        </div>
        <div className="text-sm text-gray-500">{100 - ((user?.xp || 0) % 100)} XP needed for next level</div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <div className="p-6 text-center">
              <Coins className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-gray-800">No transactions yet</h3>
              <p className="text-gray-500">Complete lessons and quizzes to earn coins</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "earn" ? "bg-indigo-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "earn" ? (
                        <TrendingUp
                          className={`h-5 w-5 ${transaction.type === "earn" ? "text-indigo-600" : "text-red-600"}`}
                        />
                      ) : (
                        <Coins
                          className={`h-5 w-5 ${transaction.type === "earn" ? "text-indigo-600" : "text-red-600"}`}
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`font-medium ${transaction.type === "earn" ? "text-indigo-600" : "text-red-600"}`}>
                    {transaction.type === "earn" ? "+" : "-"}
                    {transaction.amount}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
