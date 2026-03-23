// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from '@/api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        apiClient.setTokens(accessToken, refreshToken);
        await checkUserAuth();
      } else {
        setIsLoadingAuth(false);
      }
      
      setIsLoadingPublicSettings(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error('User auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      apiClient.clearTokens();
      
      setAuthError({
        type: 'auth_required',
        message: 'Authentication required'
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async (shouldRedirect = true) => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      
      if (shouldRedirect) {
        window.location.href = '/login';
      }
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.login(email, password);
      apiClient.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthError(null);
      return response;
    } catch (error) {
      setAuthError({
        type: 'login_failed',
        message: error.message
      });
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await apiClient.register(email, password, name);
      apiClient.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthError(null);
      return response;
    } catch (error) {
      setAuthError({
        type: 'register_failed',
        message: error.message
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
      login,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
