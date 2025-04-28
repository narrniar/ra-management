import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProfessorLayout from './components/layout/ProfessorLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ReportSubmission from './pages/ReportSubmission';
import AllReports from './pages/AllReports';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import Users from './pages/Users';
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import ProfessorProfile from './pages/professor/ProfessorProfile';
import AssignedReports from './pages/professor/AssignedReports';
import ApprovalHistory from './pages/professor/ApprovalHistory';
import Notifications from './pages/professor/Notifications';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#2C3E50',
      light: '#34495E',
      dark: '#2C3E50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Redirect PA users to professor dashboard if they're trying to access RA routes
  if (user?.role === 'PA' && (
    window.location.pathname === '/' || 
    window.location.pathname === '/dashboard'
  )) {
    return <Navigate to="/professor/dashboard" replace />;
  }
  
  return children;
};

// Component that checks for admin role
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return user && user.role === 'ADMIN' ? children : <Navigate to="/profile" />;
};

// Component that checks for professor (PA) role
const ProfessorRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return user && user.role === 'PA' ? children : <Navigate to="/profile" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ErrorBoundary>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Admin-only Routes */}
                <Route path="/register" element={
                  <AdminRoute>
                    <Register />
                  </AdminRoute>
                } />
                
                <Route path="/users" element={
                  <AdminRoute>
                    <Layout>
                      <Users />
                    </Layout>
                  </AdminRoute>
                } />
                
                {/* RA Protected Routes */}
                <Route path="/" element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/report-submission" element={
                  <PrivateRoute>
                    <Layout>
                      <ReportSubmission />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/all-reports" element={
                  <PrivateRoute>
                    <Layout>
                      <AllReports />
                    </Layout>
                  </PrivateRoute>
                } />
                
                {/* Main profile route that redirects based on role */}
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </PrivateRoute>
                } />
                
                {/* Direct routes to specific profile pages */}
                <Route path="/userprofile" element={
                  <PrivateRoute>
                    <Layout>
                      <UserProfile />
                    </Layout>
                  </PrivateRoute>
                } />
                
                <Route path="/adminprofile" element={
                  <AdminRoute>
                    <Layout>
                      <AdminProfile />
                    </Layout>
                  </AdminRoute>
                } />

                {/* Professor (PA) Routes */}
                <Route path="/professor" element={
                  <ProfessorRoute>
                    <ProfessorLayout />
                  </ProfessorRoute>
                }>
                  <Route index element={<ProfessorDashboard />} />
                  <Route path="dashboard" element={<ProfessorDashboard />} />
                  <Route path="assigned-reports" element={<AssignedReports />} />
                  <Route path="approval-history" element={<ApprovalHistory />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="profile" element={<ProfessorProfile />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 