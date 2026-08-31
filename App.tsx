import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './redux/store';
import { setUser, clearUser } from './redux/userReducer';
import { request } from './requests';
import apis from './api';
import SplashScreen from './screens/SplashScreen';
import MainNavigator from './navigation/MainNavigator';
import ToastProvider from './components/ToastProvider';
import { lightTheme, darkTheme } from './theme';

const SPLASH_MIN_DURATION = 2500;

// Handle restoring a persisted session on cold start. The splash stays visible
// until BOTH the minimum splash time has elapsed AND the session check completes.
const AppBootstrap: React.FC = () => {
  const dispatch = useDispatch();
  const [minSplashDone, setMinSplashDone] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinSplashDone(true), SPLASH_MIN_DURATION);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (token) {
          const profile = await request(apis.getProfile, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!active) return;
          dispatch(
            setUser({
              email: profile?.Email,
              username: profile?.Username,
              role: profile?.role?.RoleName,
              fullName: profile?.FullName ?? profile?.fullName,
              ...profile,
            })
          );
        }
      } catch (e: any) {
        // Only clear the token on a definitive auth failure (401/403). A
        // transient network error should NOT log the user out — they simply
        // land on a guest screen until connectivity returns.
        if (e?.status === 401 || e?.status === 403) {
          await AsyncStorage.removeItem('jwt');
          if (active) dispatch(clearUser());
        }
      } finally {
        if (active) setSessionChecked(true);
      }
    };

    bootstrap();
    return () => {
      active = false;
    };
  }, [dispatch]);

  const ready = minSplashDone && sessionChecked;

  if (!ready) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return <MainNavigator />;
};

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ToastProvider>
          <AppBootstrap />
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}
