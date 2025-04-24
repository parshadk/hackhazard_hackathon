import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../context/CourseContext";
import { server } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/ui/LoadingSpinner";

interface User {
  role: string;
  subscription: string[];
  name?: string;
  email?: string;
  phone?: string;
}

interface Course {
  _id: string;
  image: string;
  title: string;
  description: string;
  createdBy: string;
  duration: number;
  price: number;
}

interface CourseDescriptionProps {
  user: User;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ user }) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const { fetchUser } = useAuth();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id);
    }
  }, [params.id]);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        { headers: { token } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "E learning",
        description: "Learn with us",
        image: `${server}/logo.png`,
        order_id: order.id,
        handler: async (response: any) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          try {
            const { data } = await axios.post(
              `${server}/api/verification/${params.id}`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
              },
              { headers: { token } }
            );

            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();
            toast.success(data.message);
            setLoading(false);
            navigate(`/payment-success/${razorpay_payment_id}?course_id=${params.id}/`);
          } catch (error: any) {
            console.error("Verification error:", error);
            toast.error(error.response?.data?.message || "Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: { color: "#8a4baf" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Error initiating checkout");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="md:flex">
                <div className="md:w-1/2 h-96">
                  <img
                    src={course.image?.includes("res.cloudinary.com") ? course.image : `${server}/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                    }}
                  />
                </div>
                <div className="p-8 md:w-1/2 space-y-6">
                  <h1 className="text-4xl font-extrabold text-gray-900">{course.title}</h1>
                  <p className="text-gray-700 text-lg">Instructor: {course.createdBy}</p>
                  <p className="text-gray-700 text-lg">Duration: {course.duration} weeks</p>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">About This Course</h2>
                    <p className="text-gray-700">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-3xl font-bold text-gray-900">₹{course.price}</p>

                    {user.subscription.includes(course._id) ? (
                      <button
                        onClick={() => navigate(`/course/study/${course._id}`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-xl transition-transform transform hover:scale-105"
                      >
                        Start Learning
                      </button>
                    ) : (
                      <button
                        onClick={checkoutHandler}
                        className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Enroll Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseDescription;
