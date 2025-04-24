import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

// Define types for user object
interface User {
  _id: string;
}

interface PaymentSuccessProps {
  user: User | null;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ user }) => {
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const course_id = searchParams.get("course_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-md border border-blue-100 transform transition-all hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center">
          {user && course_id ? (
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Payment Successful!
            </h2>
          ) : (
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Payment Issue
            </h2>
          )}
        </div>

        <div className="p-8 text-center">
          {user && course_id ? (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-2 text-lg">
                  Your course subscription has been activated!
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  <span className="font-medium text-blue-600">Reference No:</span>{" "}
                  <span className="font-mono bg-blue-50 px-2 py-1 rounded">{params.id}</span>
                </p>
              </div>
              <Link
                to={`/course/study/${course_id}`}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg w-full"
              >
                Go to Course
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4 text-lg">
                  We couldn't verify your payment.
                </p>
                <p className="text-gray-500 text-sm">
                  Please try again or contact our support team.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg w-full"
                >
                  Go to Homepage
                </Link>
                <a
                  href="mailto:support@example.com"
                  className="inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-full transition-all duration-300 w-full"
                >
                  Contact Support
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;