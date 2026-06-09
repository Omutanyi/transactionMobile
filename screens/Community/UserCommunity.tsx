import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title } from '../../components/StyledComponents';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';

const Tab = createMaterialTopTabNavigator();

const UserCommunityContent = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: { height: 60 },
                // tabBarLabel: ({ color, focused }) => {
                //     let iconName: string;
                //     if (route.name === 'Home') {
                //         iconName = 'home-outline';
                //     } else if (route.name === 'Explore') {
                //         iconName = 'search-outline';
                //     }
                //     return (
                //         <React.Fragment>
                //             <Ionicons
                //                 name={iconName}
                //                 size={20}
                //                 color={color}
                //                 style={{ marginRight: 6, verticalAlign: 'middle' }}
                //             />
                //             <Title style={{ color, fontSize: 16, verticalAlign: 'middle' }}>
                //                 {route.name}
                //             </Title>
                //         </React.Fragment>
                //     );
                // },
                tabBarShowIcon: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
        </Tab.Navigator>
    );
};

const logo = require('../../assets/ic_launcher.png');
const Stack = createStackNavigator();

const UserCommunity = () => {
    const theme = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerTitle: 'Community',
                headerLeft: () => (
                    <Image
                        source={logo}
                        style={{ width: 32, height: 32, marginLeft: 16 }}
                    />
                ),
                headerRight: () => (
                    <Ionicons
                        name="notifications-outline"
                        size={28}
                        color={theme.primary}
                        style={{ marginRight: 16 }}
                    />
                ),
            }}
        >
            <Stack.Screen name="Community" component={UserCommunityContent} />
        </Stack.Navigator>
    );
};

export default UserCommunity;