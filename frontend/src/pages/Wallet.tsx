import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../utils/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const generateReceipt = async (payment: Payment) => {
    const receiptId = `receipt-${payment.id}`;
    const element = document.createElement("div");
  
    element.innerHTML = `
      <div style="font-family: 'Inter', sans-serif; padding: 24px; background-color: white; border-radius: 12px; width: 100%; max-width: 500px; margin: auto; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #4B0082; font-size: 24px; font-weight: 700; margin-bottom: 8px;">EduFinance</h2>
          <div style="height: 3px; width: 60px; background: #4B0082; margin: 0 auto 12px;"></div>
          <h3 style="color: #4B0082; font-size: 18px; font-weight: 600;">Payment Receipt</h3>
        </div>
        
        <div style="margin-bottom: 24px; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Date:</span>
            <span style="font-size: 14px; color: #111827; font-weight: 500;">${formatDate(payment.date)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Course:</span>
            <span style="font-size: 14px; color: #111827; font-weight: 500;">${payment.courseName || "N/A"}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Amount:</span>
            <span style="font-size: 16px; color: #4B0082; font-weight: 600;">${payment.amount} ${payment.currency}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Status:</span>
            <span style="font-size: 14px; font-weight: 500; 
              background: ${payment.status === 'paid' ? '#ecfdf5' : '#fef2f2'}; 
              color: ${payment.status === 'paid' ? '#059669' : '#dc2626'};
              padding: 2px 8px; border-radius: 12px;">
              ${payment.status}
            </span>
          </div>
          
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Transaction ID:</span>
            <span style="font-size: 14px; color: #111827; font-weight: 500;">${payment.id}</span>
          </div>
        </div>
        
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #f3f4f6;">
          <p style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">Thank you for investing in your financial education</p>
          <p style="font-size: 12px; color: #9ca3af;">EduFinance - Empowering your financial journey</p>
        </div>
      </div>
    `;
  
    document.body.appendChild(element);
  
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a1'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save(`${receiptId}.pdf`);
  
    document.body.removeChild(element);
  };

  if (loading) return (
    <div className="min-h-screen w-full p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen w-full p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
        
        {payments.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg border border-gray-200 shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-gray-500">Your payment history will appear here once you make transactions.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-900">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.courseName || "N/A"}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <button
                          onClick={() => generateReceipt(payment)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;