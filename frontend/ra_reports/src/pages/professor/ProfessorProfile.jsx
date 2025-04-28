import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Alert,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfessorProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">User information not available.</Alert>
      </Container>
    );
  }

  // Function to get user's full name based on available data
  const getFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.fullName) {
      return user.fullName;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return 'N/A';
  };

  // Get the first letter of the name for the avatar
  const getAvatarLetter = () => {
    if (user.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'P';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2
                }}
              >
                {getAvatarLetter()}
              </Avatar>
              <Typography variant="h5" component="h2" gutterBottom>
                {getFullName()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.role === 'PA' ? 'Professor' : user.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email || 'No email available'}
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={handleLogout}
                sx={{ mt: 3 }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Professor Profile Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {getFullName()}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {user.email || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Role
                </Typography>
                <Typography variant="body1">
                  {user.role === 'PA' ? 'Professor' : user.role}
                </Typography>
              </Box>
              
              {user.firstName && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    First Name
                  </Typography>
                  <Typography variant="body1">
                    {user.firstName}
                  </Typography>
                </Box>
              )}
              
              {user.lastName && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Last Name
                  </Typography>
                  <Typography variant="body1">
                    {user.lastName}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Department
                </Typography>
                <Typography variant="body1">
                  {user.department || 'Computer Science'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Faculty
                </Typography>
                <Typography variant="body1">
                  {user.faculty || 'School of Engineering'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfessorProfile; 