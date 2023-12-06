import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import Cookies from 'universal-cookie';
import { Drawer } from '@mui/material';
import DrawerList from './DrawerList';
import { useNavigate } from 'react-router-dom';

export default function Header({ isAuthenticated, setIsAuthenticated, list}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();

  const { t } = useTranslation('translation', { keyPrefix: 'Header' });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = () => {
    handleClose();
    i18n.changeLanguage(i18n.language === 'en' ? 'he' : 'en');
  }

  const logout = () => {
    handleClose();
    setIsAuthenticated(false);
    cookies.remove('userToken');
    cookies.remove('user');
    navigate('/login');
  }

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(false);
  };

  return (
    <>
    <Box >
      <AppBar position="static" sx={{backgroundColor: 'rgb(135, 0, 0)'}}>
        <Toolbar>
          {isAuthenticated && <IconButton
            onClick={() => setDrawerOpen(true)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('title')}
          </Typography>
          {isAuthenticated && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
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
                  vertical: 'top',
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
                <MenuItem onClick={changeLanguage}>{`${t("switchLan")} ${i18n.language === 'en' ? 'Hebrew' : 'לאנגלית'}`}</MenuItem>
                <MenuItem onClick={logout}>{t('logout')}</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
    {isAuthenticated && <Drawer
      anchor={i18n.language === 'en' ? 'left' : 'right'}
      open={drawerOpen}
      onClose={toggleDrawer}
    >
      <DrawerList list={list} toggleDrawer={toggleDrawer}/>
    </Drawer>}
    </>
  );
}