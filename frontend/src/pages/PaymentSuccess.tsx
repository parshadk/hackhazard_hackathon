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
  const course_id = searchParams.get("course_id")

  return (
    <div className="payment-success-page">
      {user && (
        <div className="success-message">
          <h2>Payment successful</h2>
          <p>Your course subscription has been activated</p>
          <p>Reference no - {params.id}</p>
          <Link to={`/course/study/${course_id}`} className="common-btn">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
