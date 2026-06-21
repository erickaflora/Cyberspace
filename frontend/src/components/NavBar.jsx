import React from 'react';
import { Box, Stack, Text, UnstyledButton, Group } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Users, MessageSquare, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from './Dropdown';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'The Net', path: '/', icon: Globe },
    { label: 'Chooms', path: '/chooms', icon: Users },
    { label: 'Holo', path: '/holo', icon: MessageSquare },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <Box
      style={{
        width: '260px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: 'var(--bg-pure)',
        borderRight: '1px solid var(--neon-matrix)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box',
        zIndex: 100,
      }}
    >
      {/* Brand Header */}
      <Box style={{ borderBottom: '1px solid rgba(22, 153, 118, 0.3)', paddingBottom: '20px', marginBottom: '20px' }}>
        <Text
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--neon-bright)',
            fontWeight: 'bold',
            fontSize: '20px',
            letterSpacing: '2px',
            textShadow: '0 0 8px rgba(29, 205, 159, 0.6)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          CYBERSPACE
        </Text>
      </Box>

      {/* Nav Links */}
      <Stack gap="xs" style={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={item.label}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.98 }}
              style={{ position: 'relative', width: '100%' }}
            >
              {/* Active Indicator Sliding Background */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(22, 153, 118, 0.12)',
                      borderLeft: '3px solid var(--neon-bright)',
                      zIndex: 0,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <UnstyledButton
                onClick={() => navigate(item.path)}
                className="navbar-link"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '0px',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  color: isActive ? 'var(--neon-bright)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  fontSize: '13px',
                  letterSpacing: '1px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Group gap="md">
                  <Icon size={18} style={{ color: isActive ? 'var(--neon-bright)' : 'var(--text-dim)' }} />
                  <Text span style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{item.label}</Text>
                </Group>
              </UnstyledButton>
            </motion.div>
          );
        })}
      </Stack>
      <Dropdown />
    </Box>
  );
}
