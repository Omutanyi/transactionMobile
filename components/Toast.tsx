import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import GlassCard from './GlassCard';

type ToastType = 'error' | 'success' | 'info';

interface Props {
  message: string | null;
  type?: ToastType;
  duration?: number;
}

const Toast: React.FC<Props> = ({ message, type = 'info', duration = 3000 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState<boolean>(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      const t = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setVisible(false));
      }, duration);
      return () => clearTimeout(t);
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setVisible(false));
    }
  }, [message]);

  if (!visible || !message) return null;

  const bgColor = type === 'success' ? '#1f8a36' : type === 'error' ? '#c62828' : 'rgba(60,60,60,0.8)';

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }] }]} pointerEvents="box-none">
      <GlassCard style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(0,0,0,0.12)' }}>
        <View style={[styles.inner, { borderLeftColor: bgColor }] }>
          <Text style={[styles.message, { color: '#fff' }]}>{message}</Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 44,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderLeftWidth: 6,
  },
  message: {
    fontSize: 14,
  },
});

export default Toast;
