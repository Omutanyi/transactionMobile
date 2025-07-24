import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import SendPaymentScreen from './screens/SendPaymentScreen';

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}

function MainNavigator() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user && user.email ? "Dashboard" : "Login"}>
        {user.email ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: true }} />
            <Stack.Screen name="SendPayment" component={SendPaymentScreen} options={{ title: 'Send Payment' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
