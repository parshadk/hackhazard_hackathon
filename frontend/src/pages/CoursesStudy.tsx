import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../context/CourseContext";
import { server } from "../main";

interface User {
  role: string;
  subscription: string[];
}

interface Course {
  _id: string;
  image: string;
  title: string;
  description: string;
  createdBy: string;
  duration: number;
}

interface CourseStudyProps {
  user: User;
}

const CourseStudy: React.FC<CourseStudyProps> = ({ user }) => {
  const params = useParams<{ id: string }>();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id);
    }
  }, [params.id, fetchCourse]);

  // Redirect if user is not subscribed and not an admin
  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(params.id || "")) {
      navigate("/");
    }
  }, [user, params.id, navigate]);

  return (
    <>
      {course && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-6 items-center">
            <img
              src={course.image?.includes("res.cloudinary.com") ? course.image : `${server}/${course.image}`}
              alt={course.title}
              className="w-full md:w-1/2 h-72 object-cover rounded-xl shadow-md"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Course+Image';
              }}
            />
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{course.title}</h2>
              <p className="text-gray-700 text-base">{course.description}</p>
              <p className="text-sm text-gray-600">Instructor: {course.createdBy}</p>
              <p className="text-sm text-gray-600">Duration: {course.duration} weeks</p>
              <Link to={`/lectures/${course._id}`}>
                <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-transform transform hover:scale-105">
                  Go to Lectures
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseStudy;
