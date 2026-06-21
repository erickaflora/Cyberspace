import { useState } from 'react';
import { loginUser, getCurrentUser, registerUser } from '../services/authApi';
import { useAuthContext } from '../../../context/AuthContext';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useAuthContext(); 

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loginUser(username, password);
      const userData = await getCurrentUser();
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      console.error("Login Error:", err);
      setError('Invalid Password or Username');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(username, email, password);
      
      // Auto-login after registration is successful
      await loginUser(username, password);
      const userData = await getCurrentUser();
      setUser(userData);

      return { success: true };
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading, error };
};