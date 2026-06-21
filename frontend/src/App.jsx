import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Loader, Text } from '@mantine/core';
import { useAuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import MainLayout from './layouts/MainLayout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();
  if (loading) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-pure)',
          color: 'var(--neon-bright)',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <Loader color="var(--neon-bright)" size="md" type="dots" />
        <Text size="xs" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>
          Loading...
        </Text>
      </Box>
    );
  }

  // Redirect user to login (landing page)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render feed page if logged in
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FeedPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
