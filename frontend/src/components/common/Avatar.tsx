import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src = 'https://via.placeholder.com/150',
  alt = 'User avatar',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`${sizeStyles[size]} rounded-full overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover" 
      />
    </div>
  );
};

export default Avatar;