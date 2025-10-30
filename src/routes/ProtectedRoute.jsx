// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/Layout/AppLayout';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout />;
};

export default ProtectedRoute;
