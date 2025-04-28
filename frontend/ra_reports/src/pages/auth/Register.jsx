import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircleOutline as SuccessIcon } from '@mui/icons-material';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'RA', // Default role changed to RA (was USER)
    professorEmail: '', // New field for professor's email
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Email validation function
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    // Validate professor email if role is RA
    if (formData.role === 'RA') {
      if (!formData.professorEmail) {
        return setError('Professor email is required for RA role');
      }
      if (!isValidEmail(formData.professorEmail)) {
        return setError('Please enter a valid professor email address');
      }
    }

    try {
      setError('');
      setLoading(true);
      
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        professor_email: formData.role === 'RA' ? formData.professorEmail : null, // Only send if RA
      };
      
      const result = await register(userData);
      
      if (result.success) {
        // Instead of navigating, show success message
        setSuccess(true);
        setRegisteredUser(userData);
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          role: 'RA', // Reset to default RA (was USER)
          professorEmail: '',
        });
      } else {
        setError(result.error || 'Failed to create an account');
      }
    } catch (error) {
      setError('Failed to create an account. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToProfile = () => {
    navigate('/adminprofile');
  };

  const handleRegisterAnother = () => {
    setSuccess(false);
    setRegisteredUser(null);
  };

  // If registration was successful, show success card
  if (success && registeredUser) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
            RA/PA Report System
          </Typography>
          
          <Card sx={{ width: '100%' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <SuccessIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
              
              <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
                User Registered Successfully
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {`${registeredUser.firstName} ${registeredUser.lastName} has been registered as a ${registeredUser.role}.`}
              </Typography>
              
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRegisterAnother}
                  fullWidth
                >
                  Register Another User
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleReturnToProfile}
                  fullWidth
                >
                  Return to Admin Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
          RA/PA Report System
        </Typography>
        
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography component="h2" variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              Create Account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              {/* Professor Email field - only visible when RA role is selected */}
              {formData.role === 'RA' && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="professorEmail"
                  label="Professor's Email Address"
                  name="professorEmail"
                  autoComplete="email"
                  value={formData.professorEmail}
                  onChange={handleChange}
                  error={formData.professorEmail && !isValidEmail(formData.professorEmail)}
                  helperText={formData.professorEmail && !isValidEmail(formData.professorEmail) ? 'Please enter a valid email address' : ''}
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="RA">RA</MenuItem>
                  <MenuItem value="PA">PA</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Creating Account...' : 'Register User'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="text"
                  onClick={handleReturnToProfile}
                >
                  Cancel and Return to Admin Profile
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register; 