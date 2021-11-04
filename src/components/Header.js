import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Drawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import './Header.css';

const Header = (props) => {
  const [viewState, setViewState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { headerData } = props;
  const { mobileView, drawerOpen } = viewState;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setViewState((prevState) => ({ ...prevState, mobileView: true }))
        : setViewState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();
    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const displayDesktop = () => {
    return (
      <Toolbar className="toolbar">
        {trackMyShitLogo()}
        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headerData.map(({ label, href }) => {
      return (
        <RouterLink
          component={RouterLink}
          to={href}
          color="inherit"
          style={{ textDecoration: 'none' }}
          key={label}
        >
          <MenuItem>{label}</MenuItem>
        </RouterLink>
      );
    });
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setViewState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setViewState((prevState) => ({ ...prevState, drawerOpen: false }));
    return (
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleDrawerOpen}
          {...{ 'aria-label': 'menu', 'aria-haspopup': 'true' }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
          <div className="drawerContainer">{getDrawerChoices()}</div>
        </Drawer>
        <div>{trackMyShitLogo()}</div>
      </Toolbar>
    );
  };

  const getMenuButtons = () => {
    return headerData.map(({ label, href }) => {
      return (
        <Button
          key={label}
          color="inherit"
          to={href}
          component={RouterLink}
          className="menuButton"
        >
          {label}
        </Button>
      );
    });
  };

  const trackMyShitLogo = () => {
    return (
      <Typography variant="h6" component="h1" className="logo">
        Track My Shit
      </Typography>
    );
  };

  return (
    <>
      <header>
        <AppBar className="header">
          {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
