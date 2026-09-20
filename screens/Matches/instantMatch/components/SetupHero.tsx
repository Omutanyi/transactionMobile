import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';

interface Props {
  /** Short description of what the current setup will produce. */
  summary: string;
}

/** Compact banner at the top of the setup screen. */
const SetupHero: React.FC<Props> = ({ summary }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  return (
    <View style={styles.hero}>
      <View style={styles.heroIcon}>
        <Ionicons name="flash" size={19} color={theme.primary} />
      </View>
      <View style={styles.heroBody}>
        <Text style={styles.heroTitle}>START AN INSTANT MATCH</Text>
        <Text style={styles.heroSub} numberOfLines={1}>{summary}</Text>
      </View>
      <View style={styles.heroPill}>
        <Text style={styles.heroPillText}>LIVE</Text>
      </View>
    </View>
  );
};

export default SetupHero;
