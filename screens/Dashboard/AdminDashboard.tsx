import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { Container, Title } from '../../components/StyledComponents';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminHome = () => {
  const theme = useTheme();
  return (
    <Container>
      <Title>Admin Home</Title>
    </Container>
  );
};
const AdminTournaments = () => {
  const theme = useTheme();
  return (
    <Container>
      <Title>Manage Tournaments</Title>
    </Container>
  );
};
const AdminProfile = () => {
  const theme = useTheme();
  return (
    <Container>
      <Title>Admin Profile</Title>
    </Container>
  );
};

const AdminTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Tournaments') iconName = 'trophy-outline';
          if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: (theme as any).primary,
        tabBarInactiveTintColor: (theme as any).inputBorder,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={AdminHome} />
      <Tab.Screen name="Tournaments" component={AdminTournaments} />
      <Tab.Screen name="Profile" component={AdminProfile} />
    </Tab.Navigator>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AdminDashboard;
