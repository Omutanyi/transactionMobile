export const lightTheme = {
    background: '#fff',
    card: '#f8f8f8',
    text: '#222',
    border: '#e0e0e0',
    notification: '#ff453a',
    subText: '#888',
    inputBackground: '#fff',
    inputBorder: '#ccc',
    inputText: '#222',
    error: 'red',
    button: '#007AFF',
    buttonText: '#fff',
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    info: '#5AC8FA',
    rankGold: '#D4AF37',
    rankBronze: '#A0522D',
    rankSilver: '#A8A9AD',
    statCard: '#EFF4FF',
};

export const darkTheme = {
    background: '#181818',
    card: '#1c1c1e',
    text: '#fff',
    border: '#333',
    notification: '#ff453a',
    subText: '#aaa',
    inputBackground: '#222',
    inputBorder: '#444',
    inputText: '#fff',
    error: '#ff6b6b',
    button: '#1e90ff',
    buttonText: '#fff',
    primary: '#1e90ff',
    secondary: '#5e5ce6',
    success: '#30d158',
    warning: '#ffd60a',
    info: '#64d2ff',
    rankGold: '#FFD700',
    rankBronze: '#CD7F32',
    rankSilver: '#C0C0C0',
    statCard: '#1A2035',
};

export type AppTheme = typeof lightTheme;

import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const getNavigationTheme = (theme: AppTheme, isDark: boolean) => ({
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
        ...(isDark ? DarkTheme : DefaultTheme).colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.card,
        text: theme.text,
        border: theme.border,
        notification: theme.notification,
    },
});
