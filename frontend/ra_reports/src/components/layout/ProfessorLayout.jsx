import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Drawer, Toolbar } from '@mui/material';
import TopAppBar from '../professor/TopAppBar';
import ProfessorSidebar from '../professor/ProfessorSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const ProfessorLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfile = () => {
        navigate('/professor/profile');
    };

    // Role check
    if (user?.role !== 'PA') {
        console.warn('User is not a professor, redirecting...');
        return <Navigate to="/login" replace />;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <TopAppBar 
                handleDrawerToggle={handleDrawerToggle}
                handleProfile={handleProfile}
            />
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label={t('common.navigation')}
            >
                {/* Temporary Drawer for mobile */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <ProfessorSidebar />
                </Drawer>
                {/* Permanent Drawer for desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <ProfessorSidebar />
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default ProfessorLayout; 