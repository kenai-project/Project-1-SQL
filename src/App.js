import React, { useState, useEffect } from "react";
import { Route, Link, useNavigate } from "react-router-dom";
import AnimatedRoutes from "./components/AnimatedRoutes";
import ScrollToTop from "./components/ScrollToTop";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemIcon,
  CssBaseline,
  Box,
  Button,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { ListItem, ListItemText } from '@mui/material';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import PrivateRoute from "./components/PrivateRoute";
import Report from "./components/Report";
import FHIRUploader from "./components/FHIRUploader";
import HL7Uploader from "./components/HL7Uploader";
import PatientManager from "./components/PatientManager";

import AnimeExample from "./components/AnimeExample";

import EventBus from "./common/EventBus";

const drawerWidth = 240;

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
});

const App = () => {
  const [themeMode, setThemeMode] = useState('dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const logOut = () => {
      AuthService.logout();
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
      setCurrentUser(null);
      navigate("/login");
    };

    const user = AuthService.getCurrentUser();
    if (user && user.roles) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);
    return () => {
      EventBus.remove("logout", logOut);
    };
  }, [navigate]);

  const handleLogout = () => {
    handleMenuClose();
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(null);
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
          Personicle
        </Typography>
      </Toolbar>
      <Divider />
        <List>
          <ListItem
            component={Link}
            to="/"
            onClick={() => setMobileOpen(false)}
            sx={{
              textDecoration: 'none',
              cursor: 'pointer',
              borderRadius: 1,
              transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                transform: 'scale(1.05)',
                color: '#1976d2',
              },
            }}
          >
            <ListItemIcon><HomeIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            component={Link}
            to="/about"
            onClick={() => setMobileOpen(false)}
            sx={{
              textDecoration: 'none',
              cursor: 'pointer',
              borderRadius: 1,
              transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                transform: 'scale(1.05)',
                color: '#1976d2',
              },
            }}
          >
            <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem
            component={Link}
            to="/contactus"
            onClick={() => setMobileOpen(false)}
            sx={{
              textDecoration: 'none',
              cursor: 'pointer',
              borderRadius: 1,
              transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                transform: 'scale(1.05)',
                color: '#1976d2',
              },
            }}
          >
            <ListItemIcon><ContactMailIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Contact Us" />
          </ListItem>
          {currentUser && (
            <>
              <ListItem
                component={Link}
                to="/fhir"
                onClick={() => setMobileOpen(false)}
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    transform: 'scale(1.05)',
                    color: '#1976d2',
                  },
                }}
              >
                <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                <ListItemText primary="FHIR" />
              </ListItem>
              <ListItem
                component={Link}
                to="/hl7"
                onClick={() => setMobileOpen(false)}
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    transform: 'scale(1.05)',
                    color: '#1976d2',
                  },
                }}
              >
                <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                <ListItemText primary="HL7" />
              </ListItem>
              <ListItem
                component={Link}
                to="/report"
                onClick={() => setMobileOpen(false)}
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    transform: 'scale(1.05)',
                    color: '#1976d2',
                  },
                }}
              >
                <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Report" />
              </ListItem>
          <ListItem
            component={Link}
            to="/patients"
            onClick={() => setMobileOpen(false)}
            sx={{
              textDecoration: 'none',
              cursor: 'pointer',
              borderRadius: 1,
              transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                transform: 'scale(1.05)',
                color: '#1976d2',
              },
            }}
          >
            <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Patients" />
          </ListItem>
          {/* <ListItem
            component={Link}
            to="/dremio"
            onClick={() => setMobileOpen(false)}
            sx={{
              textDecoration: 'none',
              cursor: 'pointer',
              borderRadius: 1,
              transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                transform: 'scale(1.05)',
                color: '#1976d2',
              },
            }}
          >
            <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Dremio" />
          </ListItem> */}
          {/* <ListItem
            component={Link}
            to="/spark"
            onClick={() => setMobileOpen(false)}
            sx={{
              textDecoration: 'none',
              cursor: 'pointer',
              borderRadius: 1,
              transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                transform: 'scale(1.05)',
                color: '#1976d2',
              },
            }}
          >
            <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Spark" />
          </ListItem> */}
            </>
          )}
          {showModeratorBoard && (
            <ListItem
              component={Link}
              to="/mod"
              onClick={() => setMobileOpen(false)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  transform: 'scale(1.05)',
                  color: '#1976d2',
                },
              }}
            >
              <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Moderator" />
            </ListItem>
          )}
          {showAdminBoard && (
            <ListItem
              component={Link}
              to="/admin"
              onClick={() => setMobileOpen(false)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  transform: 'scale(1.05)',
                  color: '#1976d2',
                },
              }}
            >
              <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItem>
          )}
        </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Personicle
            </Typography>
            <Tooltip title={themeMode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {currentUser ? (
              <>
                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                  sx={{ textTransform: 'none', minWidth: 'auto', paddingLeft: 1, paddingRight: 1 }}
                >
                  {currentUser.username}
                </Button>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem onClick={() => {handleMenuClose(); navigate('/profile');}}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Sign Up</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
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
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <ScrollToTop>
            <AnimatedRoutes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/mod" element={<PrivateRoute roles={["ROLE_MODERATOR"]}><BoardModerator /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute roles={["ROLE_ADMIN"]}><BoardAdmin /></PrivateRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/fhir" element={
                <PrivateRoute>
                  <FHIRUploader />
                </PrivateRoute>
              } />
              <Route path="/hl7" element={
                <PrivateRoute>
                  <HL7Uploader />
                </PrivateRoute>
              } />
              <Route path="/report" element={
                <PrivateRoute>
                  <Report />
                </PrivateRoute>
              } />
              <Route path="/patients" element={
                <PrivateRoute>
                  <PatientManager />
                </PrivateRoute>
              } />
              {/* <Route path="/dremio" element={<DremioQuery />} /> */}
            {/* <Route path="/spark" element={<SparkQuery />} /> */}
            </AnimatedRoutes>
            <AnimeExample />
          </ScrollToTop>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
