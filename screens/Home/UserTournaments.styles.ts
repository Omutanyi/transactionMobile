import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const RANK_COLORS = {
  BRONZE: '#CD7F32',
  SILVER: '#A8A9AD',
  GOLD: '#D4AF37',
} as const;

export type RankKey = keyof typeof RANK_COLORS;

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // ── Category filter chips ─────────────────────────────────────
    categoriesContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    chipText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.subText,
      marginLeft: 5,
    },
    chipTextActive: {
      color: '#fff',
    },

    // ── Featured Tournament Card ──────────────────────────────────
    featuredCard: {
      marginHorizontal: 16,
      marginBottom: 20,
      borderRadius: 18,
      overflow: 'hidden',
      minHeight: 210,
      backgroundColor: theme.card,
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    featuredBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    featuredOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8,8,28,0.78)',
    },
    featuredContent: {
      padding: 16,
      zIndex: 1,
    },
    badgesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    featuredBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(212,175,55,0.18)',
      borderWidth: 1,
      borderColor: theme.rankGold,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    featuredBadgeText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: theme.rankGold,
      letterSpacing: 1,
    },
    liveSoonBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(52,199,89,0.18)',
      borderWidth: 1,
      borderColor: theme.success,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    liveSoonDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.success,
      marginRight: 5,
    },
    liveSoonText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: theme.success,
      letterSpacing: 0.8,
    },
    featuredTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 3,
    },
    featuredSubtitle: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.55)',
      marginBottom: 10,
    },
    prizePoolLabel: {
      fontSize: 9,
      color: 'rgba(255,255,255,0.45)',
      letterSpacing: 2,
      marginBottom: 2,
    },
    featuredPrize: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.success,
      marginBottom: 14,
    },
    countdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countdownBox: {
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      minWidth: 50,
    },
    countdownValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      lineHeight: 24,
    },
    countdownUnit: {
      fontSize: 8,
      color: 'rgba(255,255,255,0.45)',
      letterSpacing: 1,
      marginTop: 3,
    },
    countdownSep: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'rgba(255,255,255,0.35)',
      marginHorizontal: 4,
      marginBottom: 14,
    },

    // ── Section Header ────────────────────────────────────────────
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 6,
    },
    viewAll: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 13,
      color: theme.primary,
      fontWeight: '600',
    },

    // ── Tournament Card ───────────────────────────────────────────
    tournamentCard: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: theme.card,
      borderRadius: 14,
      overflow: 'hidden',
    },
    cardImageWrapper: {
      position: 'relative',
    },
    cardImage: {
      width: 88,
      height: 106,
    },
    rankBadge: {
      position: 'absolute',
      bottom: 6,
      left: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 5,
    },
    rankBadgeText: {
      fontSize: 8,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.5,
    },
    cardBody: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 10,
      justifyContent: 'space-between',
    },
    cardName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
    },
    cardPrizeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dollarBadge: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.success + '28',
      borderWidth: 1,
      borderColor: theme.success,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
    },
    dollarBadgeText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: theme.success,
    },
    cardPrize: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.success,
    },
    cardPlayersRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardPlayersText: {
      fontSize: 11,
      color: theme.subText,
      marginLeft: 4,
    },

    // Card right column
    cardRight: {
      paddingVertical: 10,
      paddingRight: 12,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    cardDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardDateText: {
      fontSize: 10,
      color: theme.subText,
      marginLeft: 3,
    },
    entryFeeBadge: {
      backgroundColor: theme.success + '18',
      borderWidth: 1,
      borderColor: theme.success + '60',
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    entryFeeText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.success,
    },
    joinBtn: {
      backgroundColor: theme.primary,
      paddingHorizontal: 18,
      paddingVertical: 7,
      borderRadius: 8,
    },
    joinBtnText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',
    },

    // ── Bottom Banner ─────────────────────────────────────────────
    bottomBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 4,
      marginBottom: 24,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    bottomBannerText: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      marginLeft: 10,
    },
    bottomBannerHighlight: {
      color: theme.success,
      fontWeight: 'bold',
    },
  });

export const getHeaderOptions = (theme: AppTheme) => ({
  headerStyle: { backgroundColor: theme.card },
  headerTitleStyle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  headerTintColor: theme.text,
});
