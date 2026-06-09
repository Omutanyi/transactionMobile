import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './UserProfile';
import PersonalInfo from './PersonalInfo';
import Location from './Location';
import Notifications from './Notifications';
import Account from './Account';
import Help from './Help';

const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator initialRouteName="UserProfile" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
    <Stack.Screen name="Location" component={Location} />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="Account" component={Account} />
    <Stack.Screen name="Help" component={Help} />
  </Stack.Navigator>
);

export default ProfileStack;
