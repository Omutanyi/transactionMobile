import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { RootState } from '../redux/store';
import { AppTheme, getNavigationTheme } from '../theme';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AdminDashboard from '../screens/Dashboard/AdminDashboard';
import UserDashboard from '../screens/Dashboard/UserDashboard';
import SendPaymentScreen from '../screens/SendPaymentScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = useTheme() as AppTheme;
  const colorScheme = useColorScheme();
  const navigationTheme = getNavigationTheme(theme, colorScheme === 'dark');

  console.log('User in MainNavigator:', user);
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName={user && user.username ? (user.role === 'Admin' ? 'AdminDashboard' : 'UserDashboard') : 'Welcome'}>
        {user.username ? (
          <>
            {user.role === 'Admin' ? (
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ headerShown: false }} />
            )}
            <Stack.Screen name="SendPayment" component={SendPaymentScreen} options={{ title: 'Send Payment' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{ headerShown: true, title: 'Terms and Conditions' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
