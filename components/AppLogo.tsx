import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme';

interface AppLogoProps {
  size?: 'sm' | 'md';
  iconOnly?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', iconOnly = false }) => {
  const theme = useTheme() as AppTheme;
  const iconSize = size === 'sm' ? 15 : 20;
  const badgeSize = size === 'sm' ? 28 : 36;
  const fontSize = size === 'sm' ? 14 : 18;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: 8,
          backgroundColor: theme.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: iconOnly ? 0 : 6,
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.45,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Ionicons name="game-controller" size={iconSize} color="#fff" />
      </View>
      {!iconOnly && (
        <Text style={{ fontSize, fontWeight: 'bold', color: theme.text, letterSpacing: 0.3 }}>
          Pro<Text style={{ color: theme.primary }}>Gamer</Text>
        </Text>
      )}
    </View>
  );
};

export default AppLogo;
