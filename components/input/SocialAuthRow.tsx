import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';

export type SocialProvider = 'google' | 'facebook' | 'apple' | 'discord';

const PROVIDERS: { key: SocialProvider; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { key: 'google', label: 'Google', icon: 'logo-google', color: '#ea4335' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook', color: '#1877f3' },
  { key: 'apple', label: 'Apple', icon: 'logo-apple', color: '#ffffff' },
  { key: 'discord', label: 'Discord', icon: 'logo-discord', color: '#5865f2' },
];

interface Props {
  layout?: 'grid' | 'inline';
  onPress?: (provider: SocialProvider) => void;
}

const SocialAuthRow: React.FC<Props> = ({ layout = 'grid', onPress }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const isInline = layout === 'inline';

  return (
    <View style={styles.row}>
      {PROVIDERS.map((p) => (
        <TouchableOpacity
          key={p.key}
          style={[styles.card, isInline && styles.cardInline]}
          activeOpacity={0.8}
          onPress={() => onPress?.(p.key)}
        >
          {/* Apple icon is white; keep it visible by using text color when on its own */}
          <Ionicons name={p.icon} size={isInline ? 20 : 26} color={p.key === 'apple' ? theme.text : p.color} />
          <Text style={[styles.label, isInline && styles.labelInline]}>{isInline ? p.label.toUpperCase() : p.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    card: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 12,
      alignItems: 'center',
    },
    cardInline: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 14,
    },
    label: {
      fontSize: 11,
      color: theme.text,
      fontWeight: '600',
      marginTop: 6,
    },
    labelInline: {
      marginTop: 0,
      marginLeft: 8,
      fontSize: 12,
    },
  });

export default SocialAuthRow;
