import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { Container, Title } from '../../components/StyledComponents';
import UserProfile from '../Profile/UserProfile';
import PersonalInfo from '../Profile/PersonalInfo';
import Location from '../Profile/Location';
import Notifications from '../Profile/Notifications';
import Account from '../Profile/Account';
import Help from '../Profile/Help';
import UserHome from '../Home/UserHome';
import UserTournaments from '../Home/UserTournaments';
import UserMatches from '../Matches/UserMatches';
import OneOnOneMatchScreen from '../Matches/OneOnOneMatchScreen';
import UserCommunity from '../Community/UserCommunity';
const logo = require('../../assets/ic_launcher.png');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const UserTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: any = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Tournaments') iconName = 'trophy-outline';
          if (route.name === 'Profile') iconName = 'person-outline';
          if (route.name === 'Community') iconName = 'people-outline';
          if (route.name === 'Matches') iconName = 'football-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: (theme as any).primary,
        tabBarInactiveTintColor: (theme as any).inputBorder,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={UserHome} />
      <Tab.Screen name="Tournaments" component={UserTournaments} />
      <Tab.Screen name="Matches" component={UserMatches} />
      <Tab.Screen name="Community" component={UserCommunity} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

// const UserTabs = () => {
//   const theme = useTheme();

//   const TabNavigator = () => (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }: { color: string; size: number }) => {
//           let iconName: any = 'home-outline';
//           if (route.name === 'Home') iconName = 'home-outline';
//           if (route.name === 'Tournaments') iconName = 'trophy-outline';
//           if (route.name === 'Profile') iconName = 'person-outline';
//           if (route.name === 'Community') iconName = 'people-outline';
//           if (route.name === 'Matches') iconName = 'football-outline';
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: (theme as any).primary,
//         tabBarInactiveTintColor: (theme as any).inputBorder,
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={UserHome} />
//       <Tab.Screen name="Tournaments" component={UserTournaments} />
//       <Tab.Screen name="Matches" component={UserMatches} />
//       <Tab.Screen name="Community" component={UserCommunity} />
//       <Tab.Screen name="Profile" component={UserProfile} />
//     </Tab.Navigator>
//   );

//   return (
//     <Stack.Navigator
//       screenOptions={{
//       headerShown: true,
//       headerTitle: 'ProGamer',
//       headerLeft: () => (
//         <>
//           <Image
//             source={logo}
//             style={{ width: 32, height: 32, marginLeft: 16 }}
//           />
//         </>
//       ),
//       headerRight: () => (
//         <Ionicons
//         name="notifications-outline"
//         size={28}
//         color={(theme as any).primary}
//         style={{ marginRight: 16 }}
//         />
//       ),
//       }}
//     >
//       <Stack.Screen name="ProGamer" component={TabNavigator} />
//     </Stack.Navigator>
//   );
// };

const UserDashboard: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserTabs" component={UserTabs} options={{ headerShown: false }} />
      <Stack.Screen name="OneOnOneMatch" component={OneOnOneMatchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={{ headerShown: true, title: 'Personal Info' }} />
      <Stack.Screen name="Location" component={Location} options={{ headerShown: true, title: 'Location' }} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: true, title: 'Notifications' }} />
      <Stack.Screen name="Account" component={Account} options={{ headerShown: true, title: 'Account' }} />
      <Stack.Screen name="Help" component={Help} options={{ headerShown: true, title: 'Help' }} />
    </Stack.Navigator>
  );
};

export default UserDashboard;
