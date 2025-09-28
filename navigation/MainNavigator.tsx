import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
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
  console.log('User in MainNavigator:', user);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user && user.username ? (user.role === 'Admin' ? 'AdminDashboard' : 'UserDashboard') : 'Login'}>
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
