import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
          },
        ]}
      >
        <Ionicons name="game-controller" size={58} color="#fff" />
      </View>
      <Text style={[styles.appName, { color: theme.text }]}>
        Pro<Text style={{ color: theme.primary }}>Gamer</Text>
      </Text>
      <Text style={[styles.tagline, { color: theme.subText }]}>
        LEVEL UP YOUR GAME
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 112,
    height: 112,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
});

export default SplashScreen;
