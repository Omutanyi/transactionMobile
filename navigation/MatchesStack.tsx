import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../theme';
import OneOnOneMatchScreen from '../screens/Matches/OneOnOneMatchScreen';
import SentRequestsScreen from '../screens/Matches/SentRequestsScreen';
import GameSelectionScreen from '../screens/Matches/GameSelectionScreen';
import { Game } from '../types';

export type MatchesStackParamList = {
  GameSelection: undefined;
  OneOnOneMatch: {
    game: Game;
  };
  SentRequests: undefined;
};

const Stack = createStackNavigator<MatchesStackParamList>();

const MatchesStack: React.FC = () => {
  const theme = useTheme() as AppTheme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="GameSelection" 
        component={GameSelectionScreen}
        options={{ title: 'Select Game' }}
      />
      <Stack.Screen 
        name="OneOnOneMatch" 
        component={OneOnOneMatchScreen}
        options={({ route }) => ({ 
          title: `${route.params.game.name} - Find Players`
        })}
      />
      <Stack.Screen 
        name="SentRequests" 
        component={SentRequestsScreen}
        options={{ title: 'Sent Requests' }}
      />
    </Stack.Navigator>
  );
};

export default MatchesStack;
