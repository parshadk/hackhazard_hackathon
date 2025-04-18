import React from 'react';
import Badge from '../common/Badge';

interface LessonFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const LessonFilter: React.FC<LessonFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.value
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default LessonFilter;