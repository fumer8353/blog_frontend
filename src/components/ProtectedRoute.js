/**
 * ProtectedRoute Component
 * 
 * A higher-order component that protects routes from unauthorized access.
 * It checks if a user is authenticated and:
 * - Redirects to login page if user is not authenticated
 * - Renders the protected content if user is authenticated
 * 
 * @param {React.ReactNode} children - The child components to be protected
 * @returns {React.ReactNode} Either the protected content or a redirect to login
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Get the current user from authentication context
  const { user } = useAuth();

  // Redirect to login if no user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content if user is authenticated
  return children;
};

export default ProtectedRoute; 