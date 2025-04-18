import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  variant?: 'primary' | 'secondary' | 'xp';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showValue = true,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const variantStyles = {
    primary: 'bg-blue-500',
    secondary: 'bg-green-500',
    xp: 'bg-yellow-500',
  };
  
  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">{label}</span>
          {showValue && (
            <span className="text-sm font-medium text-gray-700">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeStyles[size]}`}>
        <div 
          className={`${variantStyles[variant]} rounded-full ${sizeStyles[size]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;