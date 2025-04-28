import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import api from '../services/api';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });

    // Handle 403 errors specifically
    if (error.message && (
        error.message.includes('403') || 
        error.message.includes('forbidden') || 
        error.message.includes('Forbidden')
      )) {
      // Clear session if it's a forbidden error
      this.handleForbiddenError();
    }
  }

  handleForbiddenError = async () => {
    try {
      // Use the API service to clear cookies and redirect
      await api.clearSessionAndRedirect();
    } catch (err) {
      console.error('Failed to handle forbidden error:', err);
      // Fallback to basic redirect
      window.location.href = '/login';
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout failed:', err);
      window.location.href = '/login';
    }
  };

  render() {
    if (this.state.hasError) {
      // Check if it's a 403 error
      const is403Error = this.state.error && 
        (this.state.error.message.includes('403') || 
         this.state.error.message.includes('forbidden') || 
         this.state.error.message.includes('Forbidden'));

      if (is403Error) {
        // For 403 errors, show a message and force re-login
        return (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            bgcolor: '#f5f5f5'
          }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
              <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h1" gutterBottom>
                Access Denied
              </Typography>
              <Typography variant="body1" paragraph>
                You don't have permission to access this resource. Your session will be redirected to the login page.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleLogout}
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Paper>
          </Box>
        );
      }

      // For other errors, show a general error message with retry option
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: '#f5f5f5'
        }}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" paragraph>
              {this.state.error && this.state.error.message}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button 
                variant="outlined" 
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 