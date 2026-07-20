import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../theme';

const { width } = Dimensions.get('window');

export const RELATED_CARD_WIDTH = 124;

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 32,
    },

    // ── Hero banner ─────────────────────────────────────────────────
    hero: {
      height: 200,
      marginHorizontal: 12,
      marginTop: 12,
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.info + '40',
    },
    heroImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(10,12,26,0.7)',
    },
    heroContent: {
      flex: 1,
      padding: 16,
      justifyContent: 'space-between',
    },
    heroGameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    heroGameName: {
      fontSize: 14,
      fontWeight: '900',
      color: '#fff',
      letterSpacing: 2,
      marginLeft: 6,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '900',
      color: '#fff',
      letterSpacing: 0.5,
      lineHeight: 30,
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 6,
    },
    heroBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    liveRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.notification,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 3,
      marginRight: 8,
    },
    liveDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: '#fff',
      marginRight: 4,
    },
    liveText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.6,
    },
    regOpenText: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.85)',
      fontWeight: '600',
    },
    prizePoolWrap: {
      alignItems: 'flex-end',
    },
    prizePoolLabel: {
      fontSize: 8,
      color: 'rgba(255,255,255,0.6)',
      letterSpacing: 1,
      marginBottom: 2,
    },
    prizePoolRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prizePoolValue: {
      fontSize: 26,
      fontWeight: '900',
      color: theme.info,
      marginRight: 6,
      textShadowColor: theme.info + '88',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },

    // ── Info grid ───────────────────────────────────────────────────
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
      paddingTop: 12,
      gap: 10,
    },
    infoCard: {
      width: (width - 24 - 10) / 2,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
    },
    infoLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    infoLabel: {
      fontSize: 9,
      color: theme.subText,
      fontWeight: '700',
      letterSpacing: 0.6,
      marginLeft: 5,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    infoValueSmall: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
    },

    // Countdown inside info card
    countdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countdownNum: {
      fontSize: 15,
      fontWeight: '900',
      color: theme.info,
    },
    countdownColon: {
      fontSize: 14,
      fontWeight: '900',
      color: theme.subText,
      marginHorizontal: 2,
    },
    countdownUnitsRow: {
      flexDirection: 'row',
      marginTop: 2,
    },
    countdownUnit: {
      fontSize: 6.5,
      color: theme.subText,
      letterSpacing: 0.4,
      width: 22,
    },

    // ── Generic section ─────────────────────────────────────────────
    section: {
      marginHorizontal: 12,
      marginTop: 16,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 1,
      marginLeft: 7,
    },
    linkText: {
      fontSize: 11,
      color: theme.info,
      fontWeight: '600',
    },

    // ── Organizer ───────────────────────────────────────────────────
    organizerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    organizerLogo: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor: theme.info + '1F',
      borderWidth: 1,
      borderColor: theme.info + '55',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    organizerInfo: {
      flex: 1,
    },
    organizerName: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.text,
    },
    organizerMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    organizerRating: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.warning,
      marginLeft: 3,
    },
    organizerReviews: {
      fontSize: 10,
      color: theme.subText,
      marginLeft: 4,
    },
    organizerSub: {
      fontSize: 10,
      color: theme.subText,
      marginTop: 2,
    },
    followBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.info,
      backgroundColor: theme.info + '14',
    },
    followBtnText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.info,
    },

    // ── Registered players ──────────────────────────────────────────
    playersScroll: {
      paddingTop: 2,
    },
    playerItem: {
      alignItems: 'center',
      marginRight: 14,
      width: 56,
    },
    playerAvatarWrap: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: theme.info,
      padding: 2,
      marginBottom: 4,
    },
    playerAvatar: {
      width: '100%',
      height: '100%',
      borderRadius: 23,
    },
    playerName: {
      fontSize: 9,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
    },
    playerRank: {
      fontSize: 8,
      color: theme.subText,
      textAlign: 'center',
    },
    morePlayers: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.statCard,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    morePlayersText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.info,
    },

    // ── Bracket ─────────────────────────────────────────────────────
    bracketRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bracketCol: {
      flex: 1,
    },
    bracketMatch: {
      backgroundColor: theme.statCard,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 8,
      marginVertical: 6,
    },
    bracketTeam: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 3,
    },
    bracketTeamName: {
      fontSize: 11,
      color: theme.text,
      fontWeight: '600',
      marginLeft: 6,
    },
    bracketTeamTbd: {
      color: theme.subText,
      fontStyle: 'italic',
    },
    bracketVs: {
      fontSize: 8,
      fontWeight: 'bold',
      color: theme.info,
      letterSpacing: 1,
      marginVertical: 1,
      marginLeft: 6,
    },
    bracketConnector: {
      width: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bracketWinnerBox: {
      flex: 1,
      backgroundColor: theme.info + '14',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.info + '55',
      padding: 10,
      alignItems: 'center',
    },
    bracketWinnerLabel: {
      fontSize: 8,
      color: theme.subText,
      letterSpacing: 0.6,
      marginBottom: 4,
    },
    bracketWinnerText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.info,
    },

    // ── Prize distribution ──────────────────────────────────────────
    podiumRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 8,
    },
    podiumCol: {
      flex: 1,
      alignItems: 'center',
    },
    podiumTrophy: {
      marginBottom: 4,
    },
    podiumBlock: {
      width: '100%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    podiumRank: {
      fontSize: 14,
      fontWeight: '900',
      color: '#fff',
    },
    podiumPrize: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 6,
    },

    // ── Rules ───────────────────────────────────────────────────────
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 9,
    },
    ruleText: {
      flex: 1,
      fontSize: 12,
      color: theme.text,
      marginLeft: 8,
      lineHeight: 16,
    },

    // ── Chat ────────────────────────────────────────────────────────
    chatTabsRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    chatTab: {
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 0.6,
      marginRight: 18,
    },
    chatMsg: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    chatAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 8,
    },
    chatBubble: {
      flex: 1,
    },
    chatNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 1,
    },
    chatName: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.text,
      marginRight: 6,
    },
    adminBadge: {
      backgroundColor: theme.secondary,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 1,
    },
    adminBadgeText: {
      fontSize: 7,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.4,
    },
    chatText: {
      fontSize: 11,
      color: theme.subText,
      lineHeight: 15,
    },
    chatInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginTop: 4,
    },
    chatInput: {
      flex: 1,
      fontSize: 12,
      color: theme.text,
      paddingVertical: 8,
    },
    chatSend: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.info,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Register button ─────────────────────────────────────────────
    registerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 12,
      marginTop: 18,
      height: 58,
      borderRadius: 16,
      backgroundColor: theme.secondary,
      borderWidth: 1.5,
      borderColor: theme.info,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 16,
      elevation: 10,
    },
    registerBtnText: {
      fontSize: 18,
      fontWeight: '900',
      color: '#fff',
      letterSpacing: 1.5,
      marginLeft: 9,
    },
    registerHint: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    registerHintText: {
      fontSize: 11,
      color: theme.warning,
      fontWeight: '600',
      marginLeft: 5,
    },

    // ── Related tournaments ─────────────────────────────────────────
    relatedScroll: {
      paddingHorizontal: 12,
      paddingTop: 4,
    },
    relatedCard: {
      width: RELATED_CARD_WIDTH,
      marginRight: 10,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    relatedImage: {
      width: '100%',
      height: 68,
    },
    relatedBody: {
      padding: 8,
    },
    relatedGame: {
      fontSize: 7.5,
      color: theme.info,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    relatedName: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 2,
    },
    relatedPrize: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.success,
      marginTop: 3,
    },
    relatedMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    relatedMeta: {
      fontSize: 8,
      color: theme.subText,
      marginLeft: 3,
    },

    // Section title used outside cards (Registered / Related headers)
    outerSectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 10,
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
    headerShareBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    headerShareText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 5,
    },
  });
