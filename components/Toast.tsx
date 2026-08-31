import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View, TouchableOpacity, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastType } from '../utils/ToastService';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface Props {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const TOAST_META: Record<ToastType, { icon: string; accent: string; label: string }> = {
  success: { icon: 'checkmark-circle', accent: '#1f8a36', label: 'SUCCESS' },
  error: { icon: 'alert-circle', accent: '#c62828', label: 'ERROR' },
  info: { icon: 'information-circle', accent: '#1976d2', label: 'INFO' },
  warning: { icon: 'warning', accent: '#f57f17', label: 'WARNING' },
};

const ToastItem: React.FC<Props> = ({ toast, onDismiss }) => {
  const progress = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const meta = TOAST_META[toast.type] ?? TOAST_META.info;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const anim = Animated.timing(progress, {
      toValue: 0,
      duration: toast.duration,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      if (finished) onDismiss(toast.id);
    });

    return () => anim.stop();
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -16,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(toast.id));
  };

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity, transform: [{ translateY }] },
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.card, { borderColor: meta.accent }]}>
        <View style={[styles.accentBar, { backgroundColor: meta.accent }]} />
        <View style={[styles.iconWrap, { backgroundColor: `${meta.accent}1A` }]}>
          <Ionicons name={meta.icon as any} size={20} color={meta.accent} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.label}>{meta.label}</Text>
          <Text style={styles.message} numberOfLines={3}>{toast.message}</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={dismiss} hitSlop={8}>
          <Ionicons name="close" size={16} color="rgba(0,0,0,0.45)" />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: meta.accent,
                width: barWidth,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const Toast: React.FC<{ toast: ToastData; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => (
  <ToastItem toast={toast} onDismiss={onDismiss} />
);

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 14,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: 'rgba(0,0,0,0.4)',
    marginBottom: 1,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    color: '#222',
    lineHeight: 17,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  progressFill: {
    height: '100%',
    width: '100%',
  },
});

export default Toast;
