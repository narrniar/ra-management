import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data - replace with API calls
const upcomingDeadlines = [
  {
    id: 1,
    title: 'Monthly Progress Report',
    dueDate: '2024-04-15',
    status: 'pending',
    project: 'Research Project A',
  },
  {
    id: 2,
    title: 'Quarterly Expense Report',
    dueDate: '2024-04-30',
    status: 'pending',
    project: 'Project Administration',
  },
  {
    id: 3,
    title: 'Research Summary',
    dueDate: '2024-05-10',
    status: 'upcoming',
    project: 'Research Project B',
  },
];

const recentActivities = [
  {
    id: 1,
    action: 'Report Submitted',
    date: '2024-04-01',
    description: 'Report',
  },
  {
    id: 3,
    action: 'Report Returned',
    date: '2024-03-25',
    description: 'Report',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Upcoming Deadlines Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Upcoming Report Deadlines
              </Typography>
              <Button
                variant="contained"
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/report-submission')}
              >
                New Report
              </Button>
            </Box>

            <Grid container spacing={2}>
              {upcomingDeadlines.map((deadline) => (
                <Grid item xs={12} key={deadline.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {deadline.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {deadline.project}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              Due: {new Date(deadline.dueDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={deadline.status}
                          color={deadline.status === 'pending' ? 'warning' : 'info'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity Timeline */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            
            <Timeline>
              {recentActivities.map((activity, index) => (
                <TimelineItem key={activity.id}>
                  <TimelineSeparator>
                    <TimelineDot color={
                      activity.action.includes('Approved') ? 'success' :
                      activity.action.includes('Returned') ? 'error' : 'primary'
                    } />
                    {index < recentActivities.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2">
                      {activity.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="inherit" />
                      {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 