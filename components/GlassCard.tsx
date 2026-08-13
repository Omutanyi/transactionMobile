import React from 'react';
import { ViewStyle, View } from 'react-native';
import { BlurView } from 'expo-blur';

interface Props {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

const GlassCard: React.FC<Props> = ({ children, style, intensity = 60 }) => {
  return (
    <BlurView intensity={intensity} style={[{ borderRadius: 12, padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' }, style]}>
      <View pointerEvents="box-none">{children}</View>
    </BlurView>
  );
};

export default GlassCard;
