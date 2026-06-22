import React from 'react';
import { Box, Text, UnstyledButton, Group, Menu } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { logoutUser } from '../features/auth/services/authApi';
import { CircleUser, Settings, LogOut } from 'lucide-react';

export default function Dropdown() {
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
    <Menu 
      shadow="md" 
      width={220} 
      position="top-start" 
      offset={8} 
      transitionProps={{ transition: 'pop', duration: 150 }}
    >
      <Menu.Target>
        <UnstyledButton
          className="navbar-link"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '0px',
            backgroundColor: 'rgba(22, 153, 118, 0.05)',
            border: '1px solid rgba(22, 153, 118, 0.2)',
            cursor: 'pointer',
          }}
        >
          <Group wrap="nowrap" gap="sm">
            <CircleUser size={36} style={{ color: 'var(--neon-bright)' }} />
            
            <Box style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
              <Text 
                size="sm" 
                style={{ 
                  color: 'var(--neon-bright)', 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                    }}
                  >
                {user?.profile_name || 'Anonymous'}
              </Text>
              <Text 
                size="xs" 
                style={{ 
                  color: 'var(--text-dim)', 
                  fontFamily: 'var(--font-mono)', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}
              >
                @{user?.username || 'guest'}
              </Text>
            </Box>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {/* Settings */}
        <Menu.Item 
          leftSection={<Settings size={14} />} 
          onClick={() => navigate('/settings')}
        >
          Settings
        </Menu.Item>

        {/* Account Management */}
        <Menu.Item 
          leftSection={<CircleUser size={14} />} 
          onClick={() => navigate(`/profile/${user?.id || 'me'}`)}
        >
          My Profile
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item 
          color="red"
          leftSection={<LogOut size={14} />} 
          onClick={handleLogout}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
