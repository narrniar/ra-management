import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  Chip,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock data for notifications
const mockNotifications = [
  { 
    id: 1, 
    type: 'report_assigned',
    title: 'New Report Assigned', 
    message: 'You have been assigned a new report: "Weekly Progress Report" from Alex Johnson', 
    date: '2023-10-15T09:30:00', 
    read: false,
    actionPath: '/professor/assigned-reports'
  },
  { 
    id: 2, 
    type: 'report_updated',
    title: 'Report Updated', 
    message: 'Maria Garcia has updated their "Research Methodology Draft" report', 
    date: '2023-10-14T14:45:00', 
    read: false,
    actionPath: '/professor/assigned-reports'
  },
  { 
    id: 3, 
    type: 'deadline_reminder',
    title: 'Review Deadline Reminder', 
    message: 'Reminder: 2 reports are due for review in the next 48 hours', 
    date: '2023-10-13T10:15:00', 
    read: true,
    actionPath: '/professor/assigned-reports'
  },
  { 
    id: 4, 
    type: 'student_message',
    title: 'Message from Student', 
    message: 'You have received a message from John Smith regarding their Literature Review', 
    date: '2023-10-12T16:20:00', 
    read: true,
    actionPath: '/professor/messages'
  },
  { 
    id: 5, 
    type: 'system_announcement',
    title: 'System Announcement', 
    message: 'The reporting system will be undergoing maintenance on October 20th from 22:00-23:00', 
    date: '2023-10-10T08:00:00', 
    read: true,
    actionPath: null
  },
];

const Notifications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Format date string to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get time elapsed since notification
  const getTimeElapsed = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    return 'Just now';
  };

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    
    // Mark as read if it was unread
    if (!notification.read) {
      setNotifications(notifications.map(n => 
        n.id === notification.id ? {...n, read: true} : n
      ));
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleAction = (path) => {
    if (path) {
      navigate(path);
    }
  };

  // Get appropriate icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'report_assigned':
      case 'report_updated':
        return <AssignmentIcon />;
      case 'deadline_reminder':
        return <HistoryIcon />;
      case 'student_message':
        return <PersonIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('notifications.title', 'Notifications')}
          {unreadCount > 0 && (
            <Chip 
              label={unreadCount} 
              color="primary" 
              size="small" 
              sx={{ ml: 2, verticalAlign: 'middle' }} 
            />
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('notifications.description', 'Stay updated with your latest activities')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedNotification ? 6 : 12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              startIcon={<DoneAllIcon />} 
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              {t('notifications.markAllRead', 'Mark All as Read')}
            </Button>
          </Box>

          <Paper>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary={t('notifications.noNotifications', 'No notifications')} 
                    secondary={t('notifications.allClear', "You're all caught up!")} 
                  />
                </ListItem>
              ) : (
                notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ 
                        bgcolor: !notification.read ? 'action.hover' : 'inherit',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.selected',
                        }
                      }}
                      onClick={() => handleSelectNotification(notification)}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: notification.read ? 'grey.400' : 'primary.main' }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                              component="span"
                              variant="subtitle1"
                              color="text.primary"
                              sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                            >
                              {notification.title}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {getTimeElapsed(notification.date)}
                            </Typography>
                          </Box>
                        }
                        secondary={notification.message}
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {selectedNotification && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {getNotificationIcon(selectedNotification.type)}
                  </Avatar>
                  <Typography variant="h6">
                    {selectedNotification.title}
                  </Typography>
                </Box>
                
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {formatDate(selectedNotification.date)}
                </Typography>
                
                <Typography variant="body1" sx={{ my: 3 }}>
                  {selectedNotification.message}
                </Typography>
                
                {selectedNotification.actionPath && (
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleAction(selectedNotification.actionPath)}
                    sx={{ mt: 2 }}
                  >
                    {t('notifications.takeAction', 'Take Action')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Notifications; 