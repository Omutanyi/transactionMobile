import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../theme';

const { width } = Dimensions.get('window');

export const FEED_WIDTH = width * 0.61;
export const SIDEBAR_WIDTH = width * 0.39;

export const STORY_RING_COLORS = ['#6C3CE1', '#E11C9B', '#1CC2E1', '#E16C1C', '#1CE15E'];

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    // ── Stories row ───────────────────────────────────────────────
    storiesScroll: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    storiesContent: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    storyItem: {
      alignItems: 'center',
      marginRight: 14,
    },
    storyRingWrapper: {
      width: 62,
      height: 62,
      borderRadius: 31,
      borderWidth: 2.5,
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },
    storyRingOwn: {
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
    },
    storyAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.statCard,
    },
    storyAddBtn: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background,
    },
    storyOnlineDot: {
      position: 'absolute',
      bottom: 1,
      right: 1,
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor: theme.success,
      borderWidth: 2,
      borderColor: theme.background,
    },
    storyUsername: {
      fontSize: 10,
      color: theme.text,
      textAlign: 'center',
      maxWidth: 62,
    },

    // ── Tab bar ───────────────────────────────────────────────────
    tabsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },
    tab: {
      paddingVertical: 11,
      marginRight: 22,
    },
    tabActive: {
      borderBottomWidth: 2.5,
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.subText,
    },
    tabTextActive: {
      color: theme.primary,
    },
    filterBtn: {
      marginLeft: 'auto',
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: theme.primary + '1A',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Two-column content area ────────────────────────────────────
    contentRow: {
      flexDirection: 'row',
    },

    // ── Feed (left column) ────────────────────────────────────────
    feedCol: {
      width: FEED_WIDTH,
      borderRightWidth: 1,
      borderRightColor: theme.border,
    },

    // ── Post Card ─────────────────────────────────────────────────
    postCard: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 7,
    },
    postAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      marginRight: 8,
    },
    postUserInfo: {
      flex: 1,
    },
    postNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    postUsername: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
      marginRight: 4,
    },
    postVerified: {
      marginRight: 4,
    },
    postTime: {
      fontSize: 10,
      color: theme.subText,
      marginTop: 1,
    },
    postMenuBtn: {
      padding: 4,
    },
    postText: {
      fontSize: 12,
      color: theme.text,
      lineHeight: 17,
      marginBottom: 7,
    },
    gameTagRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 7,
    },
    gameTagPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '18',
      borderRadius: 8,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    gameTagText: {
      fontSize: 9,
      color: theme.primary,
      fontWeight: '700',
      letterSpacing: 0.4,
      marginLeft: 3,
    },
    postMedia: {
      height: 115,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 7,
    },
    postMediaImage: {
      width: '100%',
      height: '100%',
    },
    playOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    videoDurationBadge: {
      position: 'absolute',
      bottom: 6,
      right: 6,
      backgroundColor: 'rgba(0,0,0,0.72)',
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
    },
    videoDurationText: {
      fontSize: 9,
      color: '#fff',
      fontWeight: '600',
    },
    postActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    postActionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    postAction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    postActionText: {
      fontSize: 11,
      color: theme.subText,
      marginLeft: 3,
    },

    // ── Sidebar (right column) ─────────────────────────────────────
    sidebarCol: {
      width: SIDEBAR_WIDTH,
      paddingHorizontal: 9,
      paddingTop: 12,
    },
    sidebarSection: {
      marginBottom: 16,
    },
    sidebarSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 9,
    },
    sidebarSectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
    },
    seeAllText: {
      fontSize: 10,
      color: theme.primary,
      fontWeight: '600',
    },
    sidebarDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginBottom: 14,
    },

    // ── Trending items ────────────────────────────────────────────
    trendingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 9,
    },
    trendingHashBadge: {
      width: 26,
      height: 26,
      borderRadius: 7,
      backgroundColor: theme.primary + '1A',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 7,
    },
    trendingInfo: {
      flex: 1,
    },
    trendingTag: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.text,
    },
    trendingCount: {
      fontSize: 9,
      color: theme.subText,
      marginTop: 1,
    },

    // ── Who to Follow ─────────────────────────────────────────────
    followItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    followAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 6,
    },
    followInfo: {
      flex: 1,
    },
    followUsername: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.text,
    },
    followRole: {
      fontSize: 9,
      color: theme.subText,
      marginTop: 1,
    },
    followBtn: {
      backgroundColor: theme.primary,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 7,
    },
    followBtnText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#fff',
    },

    // ── FAB ────────────────────────────────────────────────────────
    fab: {
      position: 'absolute',
      bottom: 22,
      right: 18,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 10,
      elevation: 8,
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
