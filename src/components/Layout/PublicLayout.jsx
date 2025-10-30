import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

const PublicLayout = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Centralized redirect logic - EXCLUDE assessment routes
  React.useEffect(() => {
    // Don't redirect if we're on an assessment page
    const isAssessmentRoute = location.pathname.includes('/assessment/');
    
    if (isLoggedIn && !isAssessmentRoute) {
      navigate('/app/jobs');
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-spotify-dark text-white scrollbar-spotify scrollbar-spotify-dark">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;