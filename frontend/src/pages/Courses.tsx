import React from "react";
import { CourseData } from "../context/CourseContext";
import CourseCard from "../components/common/Card";

interface Course {
  _id: string;
  image: string;
  title: string;
  createdBy: string;
  duration: number;
  description: string;
}

const Courses: React.FC = () => {
  const { courses, loading, error } = CourseData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Unlock Your <span className="text-indigo-600">Potential</span>
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Master new skills with our immersive learning experiences
          </p>
          <div className="mt-8 max-w-2xl mx-auto bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <p className="text-indigo-700 font-medium">
              "The beautiful thing about learning is that no one can take it away from you."
              <span className="block text-sm text-indigo-600 mt-1">— B.B. King</span>
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error loading courses: {error.message}</p>
              </div>
            </div>
          </div>
        ) : courses && courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course: Course) => (
                <CourseCard 
                  key={course._id} 
                  course={course}
                  className="transform hover:-translate-y-2 transition-transform duration-300"
                />
              ))}
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to begin your learning journey?</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each course is designed to take you from beginner to confident practitioner. 
                Start with any course that sparks your curiosity!
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Our Knowledge Library is Growing</h3>
            <p className="mt-2 text-gray-600">
              New courses are coming soon to help you expand your skillset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;