import React, { useState, useEffect } from 'react';
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
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
  CircularProgress,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Person as PersonIcon, 
  Security as SecurityIcon, 
  Settings as SettingsIcon, 
  PeopleAlt as PeopleIcon, 
  PersonAdd as PersonAddIcon 
} from '@mui/icons-material';
import api from '../services/api';

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock fetching users data - in a real app, this would be an API call
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // In a real application, you would use:
        // const response = await api.get('/users');
        // setUsers(response.data);
        
        // For now, just mock some users
        setTimeout(() => {
          setUsers([
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'USER' },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'USER' },
            { id: 3, firstName: 'Alex', lastName: 'Johnson', email: 'alex@example.com', role: 'USER' },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    if (tabValue === 1) {
      fetchUsers();
    }
  }, [tabValue]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRegisterNewUser = () => {
    navigate('/register');
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
    return '?';
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
                  bgcolor: 'secondary.main',
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
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Administrator" 
                  color="primary" 
                  sx={{ fontWeight: 'bold' }}
                />
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
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin profile tabs">
                  <Tab icon={<PersonIcon />} label="Profile" />
                  <Tab icon={<PeopleIcon />} label="Users" />
                  <Tab icon={<SettingsIcon />} label="Admin Settings" />
                </Tabs>
              </Box>
              
              {/* Profile Tab */}
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Admin Profile
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
                      {user.role || 'ADMIN'}
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
                </Box>
              )}
              
              {/* Users Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    User Management
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PersonAddIcon />}
                      onClick={handleRegisterNewUser}
                      sx={{ mr: 2 }}
                    >
                      Register New User
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate('/users')}
                    >
                      Create Contract
                    </Button>
                  </Box>
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {users.map((user) => (
                        <ListItem 
                          key={user.id}
                          secondaryAction={
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => console.log('View user:', user.id)}
                            >
                              View
                            </Button>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              {user.firstName ? user.firstName.charAt(0).toUpperCase() : '?'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={`${user.firstName} ${user.lastName}`} 
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {user.email}
                                </Typography>
                                {` — ${user.role}`}
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )}
              
              {/* Admin Settings Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Admin Settings
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    This section contains admin-specific settings and user management options.
                  </Alert>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PersonAddIcon />}
                    onClick={handleRegisterNewUser}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    Register New User
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SettingsIcon />}
                    onClick={() => console.log('System settings clicked')}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    System Settings
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/users')}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    Create Contract
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<PeopleIcon />}
                    onClick={() => setTabValue(1)}
                    sx={{ mb: 2 }}
                  >
                    Manage Users
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminProfile; 