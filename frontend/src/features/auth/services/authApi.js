import { apiClient } from '../../../services/api';

export const loginUser = async (username, password) => {
  return apiClient('/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  });
};

export const getCurrentUser = async () => {
  return apiClient('/users/me');
};

export const logoutUser = async () => {
  return apiClient('/auth/logout', { method: 'POST' });
};

export const registerUser = async (username, email, password) => {
  return apiClient('/users', {
    method: 'POST',
    body: { username, email, password },
  });
};