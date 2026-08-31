import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../theme';

const { width } = Dimensions.get('window');

export const TOP_PICK_WIDTH = 162;
export const FEATURED_CARD_WIDTH = Math.floor((width - 44) / 2);

export const BADGE_COLORS = {
  LIMITED: { bg: 'rgba(255,69,0,0.22)', border: '#FF4500', text: '#FF4500' },
  DEAL: { bg: 'rgba(52,199,89,0.22)', border: '#34C759', text: '#34C759' },
  NEW: { bg: 'rgba(255,215,0,0.18)', border: '#FFD700', text: '#FFD700' },
  BESTSELLER: { bg: 'rgba(90,200,250,0.22)', border: '#5AC8FA', text: '#5AC8FA' },
} as const;

export type BadgeKey = keyof typeof BADGE_COLORS;

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    // ── Search bar ──────────────────────────────────────────────────
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 14,
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 4,
      paddingHorizontal: 12,
      height: 46,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      marginHorizontal: 8,
    },

    // ── Category chips ──────────────────────────────────────────────
    chipsContent: {
      paddingHorizontal: 16,
      paddingVertical: 10,
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
      backgroundColor: theme.secondary,
      borderColor: theme.secondary,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.subText,
      marginLeft: 5,
    },
    chipTextActive: {
      color: '#fff',
    },

    // ── Hero banner ─────────────────────────────────────────────────
    heroBanner: {
      marginHorizontal: 16,
      marginBottom: 22,
      borderRadius: 18,
      overflow: 'hidden',
      height: 158,
      backgroundColor: '#0A0E1A',
    },
    heroCharImg: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '56%',
      height: '100%',
    },
    heroImgOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8,12,26,0.52)',
    },
    heroContent: {
      position: 'absolute',
      top: 16,
      left: 16,
      width: '58%',
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      lineHeight: 25,
      marginBottom: 5,
      letterSpacing: 0.4,
    },
    heroOffer: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#FFD700',
      marginBottom: 6,
    },
    heroCodeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    heroCodeLabel: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.65)',
    },
    heroCodeBadge: {
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.45)',
      borderRadius: 5,
      paddingHorizontal: 7,
      paddingVertical: 2,
      marginLeft: 5,
    },
    heroCodeText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.5,
    },
    heroRight: {
      position: 'absolute',
      top: 12,
      right: 12,
      alignItems: 'flex-end',
    },
    heroTimeBadge: {
      backgroundColor: theme.secondary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      marginBottom: 5,
    },
    heroTimeBadgeText: {
      fontSize: 9,
      color: '#fff',
      fontWeight: 'bold',
      letterSpacing: 0.8,
    },
    heroCountdownBox: {
      backgroundColor: 'rgba(0,0,0,0.65)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
    },
    heroCountdownText: {
      fontSize: 17,
      color: '#fff',
      fontWeight: 'bold',
      letterSpacing: 2,
    },
    heroDots: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    heroDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.28)',
      marginHorizontal: 3,
    },
    heroDotActive: {
      width: 18,
      backgroundColor: theme.secondary,
    },

    // ── Section header ──────────────────────────────────────────────
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
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 6,
    },
    viewAllRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 13,
      color: theme.primary,
      fontWeight: '600',
    },

    // ── Top picks horizontal cards ──────────────────────────────────
    topPicksScroll: {
      paddingLeft: 16,
      paddingRight: 6,
      marginBottom: 26,
    },
    topPickCard: {
      width: TOP_PICK_WIDTH,
      backgroundColor: theme.card,
      borderRadius: 16,
      overflow: 'hidden',
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    topPickImageWrapper: {
      width: '100%',
      height: 128,
      backgroundColor: theme.statCard,
      position: 'relative',
    },
    topPickImage: {
      width: '100%',
      height: '100%',
    },

    // ── Shared card elements ────────────────────────────────────────
    cardBadgeRow: {
      position: 'absolute',
      top: 8,
      left: 8,
      right: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    productBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 5,
      borderWidth: 1,
    },
    productBadgeText: {
      fontSize: 9,
      fontWeight: 'bold',
      letterSpacing: 0.4,
    },
    wishlistBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: 'rgba(0,0,0,0.52)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardBody: {
      padding: 10,
    },
    productBrand: {
      fontSize: 10,
      color: theme.subText,
      marginBottom: 3,
    },
    productName: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 5,
      lineHeight: 16,
    },
    starsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    starRatingText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.warning,
      marginLeft: 3,
    },
    reviewCountText: {
      fontSize: 10,
      color: theme.subText,
      marginLeft: 3,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    priceNew: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.text,
    },
    priceOld: {
      fontSize: 11,
      color: theme.subText,
      textDecorationLine: 'line-through',
      marginLeft: 7,
    },
    stockText: {
      fontSize: 10,
      color: theme.notification,
      fontWeight: '600',
      marginBottom: 7,
    },
    addToCartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
      paddingVertical: 8,
      borderRadius: 10,
    },
    addToCartText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',
      marginLeft: 5,
    },

    // ── Featured products 2-col grid ────────────────────────────────
    featuredGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 32,
    },
    featuredCard: {
      width: FEATURED_CARD_WIDTH,
      backgroundColor: theme.card,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    featuredImageWrapper: {
      width: '100%',
      height: 148,
      backgroundColor: theme.statCard,
      position: 'relative',
    },
    featuredImage: {
      width: '100%',
      height: '100%',
    },
    specsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginBottom: 5,
    },
    specPill: {
      backgroundColor: theme.primary + '18',
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    specText: {
      fontSize: 9,
      color: theme.primary,
      fontWeight: '600',
    },
  });
