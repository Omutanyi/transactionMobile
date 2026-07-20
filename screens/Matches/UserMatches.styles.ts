import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      padding: 12,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    cardImage: {
      width: 70,
      height: 70,
      borderRadius: 12,
      marginRight: 16,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    cardSubtitle: {
      color: theme.secondary,
      fontSize: 15,
    },
    cardPrize: {
      color: theme.success,
      fontSize: 15,
    },
    cardDate: {
      color: theme.text,
      fontSize: 13,
    },
    resultWon: {
      color: theme.success,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 2,
    },
    resultLost: {
      color: theme.error,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 2,
    },
    followingBadge: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    followingBadgeText: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '600',
    },
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.subText,
      fontSize: 16,
      marginTop: 12,
      textAlign: 'center',
    },
    emptySubtext: {
      color: theme.subText,
      fontSize: 14,
      marginTop: 4,
      textAlign: 'center',
    },
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: theme.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

export const getTabScreenOptions = (theme: AppTheme) => ({
  tabBarStyle: { height: 60, backgroundColor: theme.card },
  tabBarActiveTintColor: theme.primary,
  tabBarInactiveTintColor: theme.subText,
  tabBarIndicatorStyle: { backgroundColor: theme.primary },
  tabBarLabelStyle: { fontSize: 12, fontWeight: '600' as const },
  tabBarScrollEnabled: true,
});
