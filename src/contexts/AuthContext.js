import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await api.get(`/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async ({ name, email, password }) => {
    try {
      // console.log('Signup data:', { name, email, password });
      await api.post('/api/auth/signup', {
        name,
        email,
        password
      });
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error, error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to create account');
    }
  };

  const login = async ({ email, password }) => {
    try {
      // console.log('Login data:', { email, password });
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { user, success: true };
    } catch (error) {
      console.error('Login failed:', error, error.response?.data);
      throw new Error(error.response?.data?.error || 'Invalid email or password');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 