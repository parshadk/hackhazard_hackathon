import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../utils/api";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "failed" | "pending" | "refunded";
  date: string;
  courseName?: string;
  receipt?: string;
}

interface ApiResponse {
  success: boolean;
  payments: Payment[];
  message?: string;
}

const Wallet = () => {
  const { isAuthenticated } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching payment history...");
    const fetchPaymentHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !isAuthenticated) {
          throw new Error("Please login to view payment history");
        }

        const response = await axios.get<ApiResponse>(
          `${API_URL}/user/payment-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.payments) {
          console.log("API response:", response.data); // broader log
          console.log("Payments:", response.data.payments); // check if this appears
          setPayments(response.data.payments);
        } else {
          throw new Error(response.data.message || "Failed to fetch payments");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment history unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      refunded: "bg-blue-100 text-blue-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="p-4 text-center">Loading payment history...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      
      {payments.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-500">No payment records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.amount.toLocaleString()} {payment.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.courseName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.receipt && (
                      <a 
                        href={`https://dashboard.razorpay.com/receipts/${payment.receipt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Wallet;