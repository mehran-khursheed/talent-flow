// src/components/Toast.jsx

import React, { useEffect } from 'react';

// Enhanced Toast component with your app's colors
const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  // Use a custom class for positioning to allow the provider to stack toasts
  const getToastPositionStyles = () => {
      // This style is now dynamic and will be controlled by the parent ToastContainer
      return "mt-4 max-w-sm rounded-2xl border p-4 shadow-2xl backdrop-blur-sm transition-all duration-300 transform animate-in slide-in-from-right-full";
  }

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getToastStyles = () => {
    const baseStyles = getToastPositionStyles(); // Use the dynamic positioning style
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-gradient-to-br from-[#131b20] to-[#191c1f] border-spotify-green/30 text-white`;
      case 'error':
        return `${baseStyles} bg-gradient-to-br from-[#131b20] to-[#1f1313] border-red-500/30 text-white`;
      case 'info':
        return `${baseStyles} bg-gradient-to-br from-[#131b20] to-[#131a1f] border-blue-500/30 text-white`;
      default:
        return `${baseStyles} bg-gradient-to-br from-[#131b20] to-[#191c1f] border-white/20 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '🎯';
      case 'error': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-xl">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 ">
          {message}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/40 hover:text-white transition-colors text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;