// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  

  const login = () => {
    // Your login logic here
    setIsLoggedIn(true);
    // For demo, you might set some mock user data
    const mockUser = { id: 1, name: 'Demo User' };
    setUser(mockUser);
    localStorage.setItem('authToken', 'demo-token');
    localStorage.setItem('userData', JSON.stringify(mockUser));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};