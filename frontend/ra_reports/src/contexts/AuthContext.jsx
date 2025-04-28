import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // The actual API call
      const response = await api.post('/auth/authenticate', { email, password });
      console.log(response.firstName, response.lastName, response.role)
 
      let userData;
      
      // Handle the response
      if (response && response.user) {
        // If the API returns user data
        userData = response.user;
      } else {
        // If the API doesn't return user data, create a basic user object 
        // based on the available info
        userData = {
          email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role, // Default role
          // Additional fields would come from the backend
        };
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // The actual API call with the new fields
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      });
      
      // Return success without modifying the current authentication state
      // No longer setting the user, isAuthenticated, or localStorage
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Clear user data and state first
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      
      // Then call the API logout function which will clear cookies and redirect
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API logout fails, ensure the UI is logged out
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  };

  const forgotPassword = async (email) => {
    try {
      // Implement if your API supports password reset
      // await api.post('/auth/forgot-password', { email });
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 