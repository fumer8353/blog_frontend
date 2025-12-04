/**
 * Header Component
 * 
 * A responsive navigation header that includes:
 * - Company logo and name
 * - Navigation links
 * - Authentication-related buttons (Login/Signup/Logout)
 * - Role-based navigation (Admin panel for admin users)
 */

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';
import logo from '../assets/images/my-logo.png';

const Header = () => {
  // Get authentication context and navigation hook
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles user logout
   * Logs out the user and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo and Company Name Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} component={RouterLink} to="/">
          <img src={logo} alt="Company Logo" style={{ height: '40px', marginRight: '10px', display: 'block' }} />
          <Typography variant="h6" color="inherit" noWrap sx={{ color: 'text.primary' }}>
            My Tech Blog
          </Typography>
        </Box>
        
        {/* Navigation Links Section */}
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          {user ? (
            // Authenticated User Navigation
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              {/* Admin-only Navigation */}
              {user.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/admin">
                  Admin Panel
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout ({user.name})
              </Button>
            </>
          ) : (
            // Guest User Navigation
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 