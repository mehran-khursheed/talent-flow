// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ fullScreen = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div 
      className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-spotify-green`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-dark">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
