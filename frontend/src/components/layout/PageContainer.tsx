import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
    <div className="pt-20 md:pt-24 md:pl-64 min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-2 text-gray-600">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageContainer;