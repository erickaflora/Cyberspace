import React from 'react';
import { Box, Container, Center, Text, Title } from '@mantine/core';

export default function AuthLayout({ children }) {
  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-pure)',
        // grid bg
        backgroundImage: 'linear-gradient(rgba(22, 153, 118, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(22, 153, 118, 0.05) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scanline Overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Content container */}
      <Container size="xs" py="xl" style={{ position: 'relative', zIndex: 5 }}>
        <Center style={{ minHeight: '85vh', flexDirection: 'column' }}>
          
          {/* Header TODO: Add logo here */}
          <Box style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Title
              order={1}
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--neon-bright)',
                letterSpacing: '6px',
                textShadow: '0 0 10px rgba(29, 205, 159, 0.8), 0 0 20px rgba(29, 205, 159, 0.3)',
                textTransform: 'uppercase',
                fontSize: '36px',
              }}
            >
              CYBERSPACE
            </Title>
            <Text
              size="xs"
              style={{
                color: 'var(--neon-matrix)',
                letterSpacing: '2px',
                marginTop: '5px',
                textTransform: 'uppercase',
              }}
            >
              [ Welcome to Cyberspace, also known as THE NET ]
            </Text>
          </Box>

          {/* Render children (login/register form) */}
          <Box style={{ width: '100%' }}>
            {children}
          </Box>

        </Center>
      </Container>
    </Box>
  );
}
