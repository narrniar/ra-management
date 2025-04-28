import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import AdminProfile from './AdminProfile';
import ProfessorProfile from './professor/ProfessorProfile';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  // Render the appropriate profile component based on user role
  switch (user.role) {
    case 'ADMIN':
      return <AdminProfile />;
    case 'PA':
      return <ProfessorProfile />;
    case 'RA':
    case 'USER':
    default:
      return <UserProfile />;
  }
};

export default Profile; 