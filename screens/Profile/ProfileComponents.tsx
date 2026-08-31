import React, { ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';
import GlassBackground from '../../components/GlassBackground';
import GlassCard from '../../components/GlassCard';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface ScreenContainerProps {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
}

export const ProfileScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  contentContainerStyle,
}) => {
  return (
    <GlassBackground>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.containerPadding, ...(contentContainerStyle ? [contentContainerStyle] : [])]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </GlassBackground>
  );
};

interface SectionProps {
  title: string;
  icon: IconName;
  children: ReactNode;
  style?: ViewStyle;
}

export const ProfileSection: React.FC<SectionProps> = ({ title, icon, children, style }) => {
  const theme = useTheme() as AppTheme;
  return (
    <GlassCard style={[styles.card, ...(style ? [style] : [])]}>
      <View style={{ padding: 16 }}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionIconBg, { backgroundColor: theme.primary + '1A' }]}>
            <Ionicons name={icon} size={15} color={theme.primary} />
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        </View>
        <View style={styles.sectionBody}>{children}</View>
      </View>
    </GlassCard>
  );
};

interface FieldRowProps {
  icon: IconName;
  label: string;
  value: string;
  showDivider?: boolean;
}

export const ProfileField: React.FC<FieldRowProps> = ({ icon, label, value, showDivider = true }) => {
  const theme = useTheme() as AppTheme;
  return (
    <View style={[styles.fieldRow, showDivider && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
      <View style={styles.fieldIconWrap}>
        <Ionicons name={icon} size={17} color={theme.primary} />
      </View>
      <View style={styles.fieldTextWrap}>
        <Text style={[styles.fieldLabel, { color: theme.subText }]}>{label}</Text>
        <Text style={[styles.fieldValue, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );
};

interface ToggleRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  showDivider?: boolean;
  accentColor?: string;
}

export const ProfileToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  showDivider = true,
  accentColor,
}) => {
  const theme = useTheme() as AppTheme;
  return (
    <View style={[styles.toggleRow, showDivider && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
      <View style={styles.toggleLeft}>
        <View style={[styles.toggleIconBg, { backgroundColor: (accentColor || theme.primary) + '1A' }]}>
          <Ionicons name={icon} size={17} color={accentColor || theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.toggleTitle, { color: theme.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.toggleSubtitle, { color: theme.subText }]}>{subtitle}</Text> : null}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: theme.primary + '88' }}
        thumbColor={value ? theme.primary : theme.subText}
      />
    </View>
  );
};

interface MenuRowProps {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  showDivider?: boolean;
  danger?: boolean;
  accentColor?: string;
}

export const ProfileMenuRow: React.FC<MenuRowProps> = ({
  icon,
  label,
  value,
  onPress,
  showDivider = true,
  danger = false,
  accentColor,
}) => {
  const theme = useTheme() as AppTheme;
  const color = danger ? theme.error : accentColor || theme.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.menuRow, showDivider && { borderBottomWidth: 1, borderBottomColor: theme.border }]}
    >
      <View style={[styles.menuIconBg, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={17} color={color} />
      </View>
      <Text style={[styles.menuLabel, { color: theme.text }]}>{label}</Text>
      {value ? <Text style={[styles.menuValue, { color: theme.subText }]}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={16} color={theme.subText} />
    </TouchableOpacity>
  );
};

interface BadgePillProps {
  label: string;
  color: string;
  outlined?: boolean;
}

export const BadgePill: React.FC<BadgePillProps> = ({ label, color, outlined = false }) => {
  const theme = useTheme() as AppTheme;
  return (
    <View
      style={[
        styles.badgePill,
        outlined
          ? { borderWidth: 1, borderColor: color, backgroundColor: 'transparent' }
          : { backgroundColor: color + '22' },
      ]}
    >
      <Text style={[styles.badgePillText, { color }]}>{label}</Text>
    </View>
  );
};

interface HeaderCardProps {
  avatar: any;
  name: string;
  handle: string;
  subtitle?: string;
}

export const ProfileHeaderCard: React.FC<HeaderCardProps> = ({ avatar, name, handle, subtitle }) => {
  const theme = useTheme() as AppTheme;
  return (
    <GlassCard style={{ marginBottom: 16 }}>
      <View style={styles.headerContent}>
        <View style={styles.headerAvatarWrap}>
          <Ionicons name="shield-checkmark" size={32} color={theme.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={[styles.headerName, { color: theme.text }]}>{name}</Text>
          <Text style={[styles.headerHandle, { color: theme.primary }]}>{handle}</Text>
          {subtitle ? <Text style={[styles.headerSubtitle, { color: theme.subText }]}>{subtitle}</Text> : null}
        </View>
        <Ionicons name="checkmark-circle" size={22} color={theme.success} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  containerPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionBody: {
    marginTop: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  fieldIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fieldTextWrap: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  menuValue: {
    fontSize: 12,
    marginRight: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,144,255,0.15)',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerHandle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },
});
