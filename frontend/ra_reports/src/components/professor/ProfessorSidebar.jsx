import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment'; 
import HistoryIcon from '@mui/icons-material/History';      
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTranslation } from 'react-i18next';

const ProfessorSidebar = () => {
    const { t } = useTranslation();

    const menuItems = [
        {
            text: t('common.dashboard'),
            path: '/professor/dashboard',
            icon: <DashboardIcon />,
            label: t('common.dashboard')
        },
        {
            text: t('assignedReports.title', 'Assigned Reports'),
            path: '/professor/assigned-reports',
            icon: <AssignmentIcon />,
            label: t('assignedReports.title', 'Assigned Reports')
        },
        {
            text: t('approvalHistory.title', 'Approval History'),
            path: '/professor/approval-history',
            icon: <HistoryIcon />,
            label: t('approvalHistory.title', 'Approval History')
        },
        {
            text: t('notifications.title', 'Notifications'),
            path: '/professor/notifications',
            icon: <NotificationsIcon />,
            label: t('notifications.title', 'Notifications')
        },
    ];

    return (
        <Box component="nav">
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={item.path}
                            aria-label={item.label}
                            sx={{
                                '&.active': {
                                    backgroundColor: 'action.selected',
                                    fontWeight: 'fontWeightBold',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );
};

export default ProfessorSidebar; 