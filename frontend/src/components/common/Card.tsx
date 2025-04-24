import React from 'react';
import { Link } from 'react-router-dom';
import { server } from '../../main';
import { useAuth } from '../../context/AuthContext';

const Card = ({ course, isPurchased }) => {
  // if (!course) return null;
  const { isAuthenticated,user} = useAuth();
  return (
    <Link 
      to={`/lesson/${course._id}`} 
      className="block group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-200"
    >
      {/* Image with gradient overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={`${server}/${course.image}`} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Course+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {/* Display enrollment status */}
        
        {/* Price tag or Purchased badge */}
        {isPurchased ? (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            Purchased
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            ₹{course.price}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
            {course.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-500">{course.duration} hours</span>
          </div>

          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm text-gray-500">{course.createdBy}</span>
          </div>
        </div>
        {isAuthenticated && user && (user as any).subscription.includes(course._id) ? (
          <p className="enrollment-status">Enrolled</p>
        ) : (
          isAuthenticated && user && <p className="enrollment-status">Not Enrolled</p>
        )}

        {/* Hover effect indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary-600/10 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;