import React from 'react';
import { ViewStyle, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../theme';

export type GlassTint = 'light' | 'dark' | 'default' | 'extraLight' | 'regular';

interface Props {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  tint?: GlassTint;
  radius?: number;
}

/**
 * Theme-aware GlassCard. Uses expo-blur's BlurView for a genuine frosted-glass
 * effect. Tint and translucency adapt to the active theme so it looks correct
 * in both light and dark mode.
 */
const GlassCard: React.FC<Props> = ({
  children,
  style,
  intensity = 55,
  tint,
  radius = 16,
}) => {
  const theme = useTheme() as AppTheme;
  const isDark = theme.background === '#181818';

  const resolvedTint = tint ?? (isDark ? 'dark' : 'light');

  const glassStyle: ViewStyle = {
    borderRadius: radius,
    backgroundColor: isDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.42)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  };

  return (
    <BlurView intensity={intensity} tint={resolvedTint} style={[glassStyle, style]}>
      <View pointerEvents="box-none">{children}</View>
    </BlurView>
  );
};

export default GlassCard;
