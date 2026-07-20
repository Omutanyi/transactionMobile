import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '../../theme';
import UserProfile from '../Profile/UserProfile';
import UserHome from '../Home/UserHome';
import UserTournaments from '../Home/UserTournaments';
import OneOnOneMatchScreen from '../Matches/OneOnOneMatchScreen';
import UserCommunity from '../Community/UserCommunity';
import UserShop from '../Shop/UserShop';
import CreateTournament from '../Tournaments/CreateTournament';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const UserTabs = () => {
  const theme = useTheme() as AppTheme;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName: IconName = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Tournaments') iconName = focused ? 'trophy' : 'trophy-outline';
          if (route.name === 'Community') iconName = focused ? 'people' : 'people-outline';
          if (route.name === 'Shop') iconName = focused ? 'storefront' : 'storefront-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 28,
                borderRadius: 14,
                backgroundColor: focused ? `${theme.primary}22` : 'transparent',
              }}
            >
              <Ionicons name={iconName} size={21} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.07,
          shadowRadius: 6,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={UserHome} />
      <Tab.Screen name="Tournaments" component={UserTournaments} />
      <Tab.Screen name="Community" component={UserCommunity} />
      <Tab.Screen name="Shop" component={UserShop} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

const UserDashboard: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserTabs" component={UserTabs} options={{ headerShown: false }} />
      <Stack.Screen name="OneOnOneMatch" component={OneOnOneMatchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateTournament" component={CreateTournament} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default UserDashboard;
