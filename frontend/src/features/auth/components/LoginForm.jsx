import React, { useState } from 'react';
import { Stack, Box, Text } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../../components/TextInput';
import PasswordInput from '../../../components/PasswordInput';
import PrimaryButton from '../../../components/PrimaryButton';
import SecondaryButton from '../../../components/SecondaryButton';
import Modal from '../../../components/Modal';
import Toast from '../../../components/Toast';
import { loginValidation } from '../utils/authValidations';


export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ opened: false, message: '', type: 'error' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    const usernameError = loginValidation.username(username);
    if (usernameError) newErrors.username = usernameError;

    const passwordError = loginValidation.password(password);
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      setToast({
        opened: true,
        message: 'DECRYPT_SUCCESS: Welcome back to Cyberspace.',
        type: 'success',
      });
      setTimeout(() => navigate('/'), 1000);
    } else {
      setErrors({ form: result.error || 'Invalid credentials.' });
    }
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="md">
          <Box style={{ borderBottom: '1px solid rgba(22, 153, 118, 0.3)', paddingBottom: '12px' }}>
            <Text
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--neon-bright)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '18px',
                fontWeight: 'bold',
                textShadow: '0 0 8px rgba(29, 205, 159, 0.6)',
              }}
            >
              System.Access_
            </Text>
          </Box>

          {/* backend errors */}
          {errors.form && (
            <Text
              size="sm"
              style={{
                color: '#ff4a4a',
                fontFamily: 'var(--font-mono)',
                fontWeight: 'bold',
                border: '1px solid #ff4a4a',
                padding: '8px',
                backgroundColor: 'rgba(255, 0, 0, 0.05)',
              }}
            >
              [SYSTEM_ERROR] // {errors.form}
            </Text>
          )}

          <TextInput
            required
            label="Username"
            placeholder="enter credentials..."
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
              if (errors.form) setErrors((prev) => ({ ...prev, form: null }));
            }}
            error={errors.username}
            disabled={isLoading}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              if (errors.form) setErrors((prev) => ({ ...prev, form: null }));
            }}
            error={errors.password}
            disabled={isLoading}
          />

          <PrimaryButton type="submit" loading={isLoading}>
            Log In
          </PrimaryButton>

          <SecondaryButton onClick={() => navigate('/register')}>
            Register
          </SecondaryButton>
        </Stack>
      </form>

      <Toast
        opened={toast.opened}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, opened: false }))}
      />
    </Modal>
  );
}
