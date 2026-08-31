import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Decorative backdrop for glassmorphism. Renders soft, colorful translucent
 * blobs behind the content so that BlurView-based glass cards have something
 * to sample — this is what gives the frosted-glass effect its depth.
 */
const GlassBackground: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.blobTopRight} />
      <View style={styles.blobMidLeft} />
      <View style={styles.blobBottomRight} />
      <View style={styles.blobTopLeft} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  blobTopRight: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(30,144,255,0.16)',
  },
  blobMidLeft: {
    position: 'absolute',
    top: '32%',
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(94,92,230,0.16)',
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: 30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,215,0,0.12)',
  },
  blobTopLeft: {
    position: 'absolute',
    top: '58%',
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,69,58,0.1)',
  },
});

export default GlassBackground;
