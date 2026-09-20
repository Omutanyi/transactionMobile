import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';

interface Props {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

/** Phone-notification opt-in for the match and any rematches. */
const NotificationToggle: React.FC<Props> = ({ enabled, onChange }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleIcon}>
        <Ionicons name="notifications-outline" size={17} color={theme.info} />
      </View>
      <View style={styles.toggleBody}>
        <Text style={styles.toggleTitle}>Phone notifications</Text>
        <Text style={styles.toggleSub}>Alerts for starts, results and rematches</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onChange}
        trackColor={{ false: theme.border, true: theme.info }}
        thumbColor="#fff"
        style={styles.switch}
      />
    </View>
  );
};

export default NotificationToggle;
