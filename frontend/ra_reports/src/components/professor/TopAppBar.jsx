import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Box, 
    Menu, 
    MenuItem,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'kk', label: 'Қазақша' }
];

const TopAppBar = ({ handleDrawerToggle, handleProfile }) => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [langMenuAnchor, setLangMenuAnchor] = useState(null);

    const handleLanguageClick = (event) => {
        setLangMenuAnchor(event.currentTarget);
    };

    const handleLanguageClose = (lang) => {
        if (lang) {
            i18n.changeLanguage(lang);
            localStorage.setItem('i18nextLng', lang);
        }
        setLangMenuAnchor(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            handleClose();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleProfileClick = () => {
        handleClose();
        handleProfile();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label={t('common.openMenu')}
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {t('common.dashboard')}
                </Typography>

                {/* Language Selector */}
                <Box sx={{ mr: 2 }}>
                    <Button
                        color="inherit"
                        startIcon={<LanguageIcon />}
                        onClick={handleLanguageClick}
                    >
                        {languages.find(lang => lang.code === i18n.language)?.label || 'English'}
                    </Button>
                    <Menu
                        anchorEl={langMenuAnchor}
                        open={Boolean(langMenuAnchor)}
                        onClose={() => handleLanguageClose(null)}
                    >
                        {languages.map((lang) => (
                            <MenuItem
                                key={lang.code}
                                onClick={() => handleLanguageClose(lang.code)}
                                selected={i18n.language === lang.code}
                            >
                                {lang.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* User Menu */}
                <Box>
                    <IconButton
                        size="large"
                        aria-label={t('common.userMenu')}
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfileClick}>
                            {t('common.profile')}
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                            {t('common.logout')}
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopAppBar; 