import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import './AnimatedNavButtonOverride.css';

const AnimatedNavButton = ({ icon, label, to, onClick }) => (
  <ListItem
    button
    component={Link}
    to={to}
    onClick={onClick}
    sx={{
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
      borderRadius: 1,
      '& a': {
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
        '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
          transform: 'scale(1.05)',
          color: '#1976d2',
          textDecoration: 'none',
        },
      },
    }}
  >
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
);

export default AnimatedNavButton;
