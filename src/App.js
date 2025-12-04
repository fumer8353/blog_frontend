// Main application component that serves as the root of the React application
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * App Component
 * 
 * This is the root component that:
 * 1. Wraps the application with authentication context
 * 2. Sets up routing using React Router
 * 3. Renders the main application routes
 */
function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
