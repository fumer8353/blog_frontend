import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';
import logo from '../../assets/images/my-logo.png';
import '../../styles/auth/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(formData);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="auth-container">
      <Paper className="auth-paper" elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={logo} alt="Company Logo" style={{ height: '50px' }} />
        </Box>
        <Typography variant="h4" className="auth-title">
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="auth-error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            className="form-field"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            className="form-field"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="auth-submit"
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" className="auth-link">
          Don't have an account?{' '}
          <Link to="/signup">Sign up</Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login; 