// src/components/Layout/TopBar.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiUserCircle, HiChevronDown, HiBell } from 'react-icons/hi';

const TopBar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('jobs')) return 'Jobs';
    if (path.includes('candidates')) return 'Candidates';
    if (path.includes('assessments')) return 'Assessments';
    return 'Dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-black/95 backdrop-blur-md border-b border-spotify-light-dark/30 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Left Section - Page Title */}
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-spotify-light-gray hover:text-white transition-colors">
          <HiBell size={24} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-spotify-green rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="flex items-center space-x-3 bg-spotify-light-dark/40 hover:bg-spotify-light-dark/60 rounded-full px-4 py-2 cursor-pointer transition-all group">
          <HiUserCircle size={32} className="text-spotify-light-gray" />
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-white">{user?.name || 'Demo User'}</p>
            <p className="text-xs text-spotify-light-gray">{user?.role || 'HR Manager'}</p>
          </div>
          <HiChevronDown size={16} className="text-spotify-light-gray group-hover:text-white transition-colors" />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-spotify-green/10 text-spotify-green hover:bg-spotify-green hover:text-black font-semibold py-2.5 px-6 rounded-full transition-all duration-200 border border-spotify-green/30 hover:border-spotify-green"
        >
          Log Out
        </button>
      </div>
    </header>
  );
};

export default TopBar;