import React from 'react';
import { Box } from '@mantine/core';
import NavBar from '../components/NavBar';

export default function MainLayout({ children }) {
  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-pure)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
      }}
    >
      {/* Sidebar Navigation */}
      <NavBar />

      {/* Main Page Content Wrapper */}
      <Box
        component="main"
        style={{
          marginLeft: '260px',
          flexGrow: 1,
          minHeight: '100vh',
          padding: '40px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
