import React from 'react';
import { Box, Title, Text, Button } from '@mantine/core';
import { useAuthContext } from '../context/AuthContext';
import { logoutUser } from '../features/auth/services/authApi';
import { useNavigate } from 'react-router-dom';

export default function FeedPage() {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-pure)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        padding: '2rem',
      }}
    >
      <Title order={2} style={{ color: 'var(--neon-bright)' }}>
        FEED PAGE
      </Title>
      <Text mt="md">Welcome, {user?.username || 'Guest'}.</Text>
      
      <Button 
        mt="xl" 
        variant="outline" 
        color="red" 
        onClick={handleLogout}
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Log Out
      </Button>
    </Box>
  );
}
