import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../theme';

const { width } = Dimensions.get('window');

export const GAME_CARD_WIDTH = 92;
export const GAME_CARD_SELECTED_WIDTH = 104;

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 24,
    },

    // ── Section header ──────────────────────────────────────────────
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 18,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 1.5,
      marginLeft: 7,
    },
    sectionSpacer: { flex: 1 },

    // ── Game selector carousel ──────────────────────────────────────
    gamesContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 6,
      alignItems: 'flex-end',
    },
    gameCard: {
      width: GAME_CARD_WIDTH,
      height: 132,
      borderRadius: 14,
      overflow: 'hidden',
      marginRight: 10,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    gameCardSelected: {
      width: GAME_CARD_SELECTED_WIDTH,
      height: 152,
      borderWidth: 2,
      borderColor: theme.info,
      shadowColor: theme.info,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
    gameImage: {
      width: '100%',
      height: '100%',
    },
    gameImageOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(8,10,22,0.28)',
    },
    selectedBadge: {
      position: 'absolute',
      top: 6,
      alignSelf: 'center',
      backgroundColor: theme.info,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    selectedBadgeText: {
      fontSize: 8,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.8,
    },
    gameRankNumber: {
      position: 'absolute',
      top: 26,
      alignSelf: 'center',
      fontSize: 34,
      fontWeight: '900',
      color: '#fff',
      textShadowColor: 'rgba(0,0,0,0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    gameNameBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(8,10,22,0.78)',
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
    gameName: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },

    // ── Pagination dots ─────────────────────────────────────────────
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
      marginBottom: 4,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.border,
      marginHorizontal: 3,
    },
    dotActive: {
      width: 18,
      backgroundColor: theme.info,
    },

    // ── Generic option selector cards ───────────────────────────────
    selectorRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 10,
    },
    optionCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: theme.border,
      paddingVertical: 14,
      paddingHorizontal: 6,
      alignItems: 'center',
    },
    optionCardActive: {
      borderColor: theme.info,
      backgroundColor: theme.info + '14',
      shadowColor: theme.info,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 9,
      elevation: 5,
    },
    optionIconCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      backgroundColor: theme.statCard,
    },
    optionIconCircleActive: {
      backgroundColor: theme.info + '26',
    },
    optionLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
    },
    optionLabelMuted: {
      color: theme.subText,
    },
    optionSub: {
      fontSize: 11,
      color: theme.subText,
      marginTop: 2,
      fontWeight: '600',
    },
    optionSubActive: {
      color: theme.info,
    },

    // ── Skill level connector ───────────────────────────────────────
    skillConnector: {
      position: 'absolute',
      top: 35,
      left: '20%',
      right: '20%',
      height: 2,
      backgroundColor: theme.border,
      zIndex: -1,
    },

    // ── Stake coins ─────────────────────────────────────────────────
    coinsRow: {
      flexDirection: 'row',
      height: 22,
      alignItems: 'center',
      marginBottom: 8,
    },
    coin: {
      width: 13,
      height: 13,
      borderRadius: 7,
      backgroundColor: theme.rankGold,
      borderWidth: 1,
      borderColor: theme.background,
      marginLeft: -3,
    },

    // ── Stat / matchmaking cards ────────────────────────────────────
    card: {
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    cardHeaderTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 1.2,
      marginLeft: 7,
    },

    // Quick stats columns
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      height: 56,
      backgroundColor: theme.border,
    },
    statLabel: {
      fontSize: 9,
      color: theme.subText,
      letterSpacing: 0.6,
      marginBottom: 6,
      fontWeight: '600',
    },
    rankEmblem: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.info + '1F',
      marginBottom: 4,
    },
    rankName: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
    },
    rankSub: {
      fontSize: 10,
      color: theme.subText,
      marginTop: 1,
    },

    // Win-rate ring
    ring: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 4,
      borderColor: theme.success,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      backgroundColor: theme.success + '12',
    },
    ringText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
    },

    // Recent form bars
    barsRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 38,
      marginBottom: 5,
    },
    bar: {
      width: 6,
      borderRadius: 3,
      marginHorizontal: 2,
    },
    formText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
    },

    // ── Matchmaking radar ───────────────────────────────────────────
    radarWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 130,
      marginBottom: 6,
    },
    radarOuter: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 1,
      borderColor: theme.info + '40',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
    radarMid: {
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 1,
      borderColor: theme.info + '60',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
    radarInner: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.info + '22',
      borderWidth: 1.5,
      borderColor: theme.info,
      alignItems: 'center',
      justifyContent: 'center',
    },
    matchStatusText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    matchSubText: {
      fontSize: 11,
      color: theme.subText,
      textAlign: 'center',
      marginTop: 4,
    },
    matchSubAccent: {
      color: theme.info,
      fontWeight: 'bold',
    },

    // ── FIND MATCH button ───────────────────────────────────────────
    findBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 18,
      height: 58,
      borderRadius: 16,
      backgroundColor: theme.info,
      shadowColor: theme.info,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 10,
    },
    findBtnCancel: {
      backgroundColor: theme.notification,
      shadowColor: theme.notification,
    },
    findBtnText: {
      fontSize: 18,
      fontWeight: '900',
      color: '#fff',
      letterSpacing: 1,
      marginLeft: 8,
    },

    // ── Recent opponents ────────────────────────────────────────────
    opponentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 10,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 10,
    },
    opponentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    opponentInfo: {
      flex: 1,
    },
    opponentName: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
    },
    opponentMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    opponentRank: {
      fontSize: 10,
      color: theme.info,
      fontWeight: '600',
    },
    opponentTime: {
      fontSize: 10,
      color: theme.subText,
      marginLeft: 8,
    },
    resultBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      marginRight: 8,
    },
    resultBadgeText: {
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    rematchBtn: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: theme.info + '1A',
      borderWidth: 1,
      borderColor: theme.info,
    },
    rematchBtnText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.info,
    },

    // ── Bottom stats bar ────────────────────────────────────────────
    bottomBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    bottomStat: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    bottomStatValue: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 5,
    },
    bottomStatLabel: {
      fontSize: 9,
      color: theme.subText,
      marginLeft: 5,
      letterSpacing: 0.4,
    },
    bottomDivider: {
      width: 1,
      height: 22,
      backgroundColor: theme.border,
    },

    // ── Header pieces ───────────────────────────────────────────────
    headerLeftRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    headerBackBtn: {
      padding: 4,
      marginRight: 4,
    },
    headerRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 14,
    },
    headerAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      marginLeft: 12,
      borderWidth: 1.5,
      borderColor: theme.info,
    },
    headerTitleText: {
      fontSize: 19,
      fontWeight: '900',
      color: theme.text,
      letterSpacing: 1,
    },
    headerTitleAccent: {
      color: theme.info,
    },
  });
