import React from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  CardActions
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Mock data for dashboard stats
  const dashboardStats = [
    {
      title: t('assignedReports.title', 'Assigned Reports'),
      count: 8,
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#1976D2',
      path: '/professor/assigned-reports'
    },
    {
      title: t('approvalHistory.title', 'Approval History'),
      count: 25,
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      color: '#2E7D32',
      path: '/professor/approval-history'
    },
    {
      title: t('notifications.title', 'Notifications'),
      count: 3,
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      color: '#ED6C02',
      path: '/professor/notifications'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('common.welcome')}, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('professor.dashboardDescription', 'Your professor dashboard overview')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box mr={2} display="flex" alignItems="center" justifyContent="center" sx={{ 
                    color: 'white', 
                    bgcolor: stat.color,
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    p: 1
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.count}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(stat.path)}
                  sx={{ ml: 1, mb: 1 }}
                >
                  {t('common.viewDetails')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('assignedReports.recentTitle', 'Recently Assigned Reports')}
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1">
              {t('professor.noRecentReports', 'No recently assigned reports to display.')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfessorDashboard; 