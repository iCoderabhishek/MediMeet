import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/useAppStore';
import { authService } from './src/services/authService';
import { getAuthToken } from './src/services/api';

const App: React.FC = () => {
  const { setUser, setAuthenticated, setLoading } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    
    try {
      const token = await getAuthToken();
      
      if (token) {
        // Try to get user profile with existing token
        const response = await authService.getProfile();
        
        if (response.success && response.data) {
          setUser(response.data);
          setAuthenticated(true);
        } else {
          // Token is invalid, remove it
          await authService.logout();
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <AppNavigator />
    </>
  );
};

export default App;