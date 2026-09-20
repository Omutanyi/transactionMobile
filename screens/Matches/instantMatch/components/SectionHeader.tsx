import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  /** Optional step number rendered in a small badge. */
  step?: number;
  icon: IconName;
  title: string;
  /** Right-aligned hint (e.g. a counter or the current selection). */
  hint?: string;
  /** Overrides the accent colour for this section. */
  accent?: string;
}

/** Compact, colour-coded section header used throughout the setup screen. */
const SectionHeader: React.FC<Props> = ({ step, icon, title, hint, accent }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const color = accent ?? theme.primary;

  return (
    <View style={styles.sectionRow}>
      {step !== undefined && (
        <View
          style={[
            styles.stepBadge,
            { backgroundColor: color + '1F', borderColor: color + '44' },
          ]}
        >
          <Text style={[styles.stepBadgeText, { color }]}>{step}</Text>
        </View>
      )}
      <Ionicons name={icon} size={13} color={color} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionSpacer} />
      {hint ? <Text style={[styles.sectionHint, { color }]}>{hint}</Text> : null}
    </View>
  );
};

export default SectionHeader;
