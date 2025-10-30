// App.js
import { RouterProvider } from 'react-router-dom';
import React from 'react';
import { router } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import "./App.css";
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Add the scrollbar class to the html element
    document.documentElement.classList.add('scrollbar-spotify-main');
  }, []);
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f1f1f', 
            color: '#fff',          
            border: '1px solid #444', 
          },
          success: {
            style: {
              background: '#22c55e',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444', 
              color: '#fff',
            },
          },
          duration: 3000, 
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;