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
      paddingBottom: 28,
    },

    // ── Header / section rows ───────────────────────────────────────
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

    // ── Step badge ──────────────────────────────────────────────────
    stepBadge: {
      backgroundColor: theme.primary + '1A',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginRight: 7,
    },
    stepBadgeText: {
      fontSize: 10,
      fontWeight: '900',
      color: theme.primary,
      letterSpacing: 0.8,
    },

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
      borderColor: theme.primary,
      shadowColor: theme.primary,
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
      backgroundColor: theme.primary,
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
    gameNameBarLayer: {
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
    maxPlayersBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(8,10,22,0.8)',
      borderTopLeftRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 3,
    },
    maxPlayersText: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#fff',
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
      backgroundColor: theme.primary,
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
      borderColor: theme.primary,
      backgroundColor: theme.primary + '14',
      shadowColor: theme.primary,
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
      backgroundColor: theme.primary + '26',
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
      color: theme.primary,
    },

    // ── Stake amount / input row ────────────────────────────────────
    amountRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 10,
    },
    amountInputWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
      height: 48,
    },
    amountCurrency: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.success,
      marginRight: 6,
    },
    amountInput: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      paddingVertical: 8,
    },
    quickAmount: {
      backgroundColor: theme.statCard,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 14,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickAmountActive: {
      backgroundColor: theme.primary + '1F',
      borderColor: theme.primary,
    },
    quickAmountText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
    },
    quickAmountTextActive: {
      color: theme.primary,
    },

    // ── Chalkman / escrow details card ──────────────────────────────
    escrowCard: {
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: theme.statCard,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.warning + '55',
      padding: 14,
    },
    escrowTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    escrowTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.warning,
      letterSpacing: 0.5,
      marginLeft: 7,
    },
    escrowDesc: {
      fontSize: 11,
      color: theme.subText,
      lineHeight: 16,
    },
    chalkmanRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      marginTop: 8,
    },
    chalkmanAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
    },
    chalkmanInfo: {
      flex: 1,
    },
    chalkmanName: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
    },
    chalkmanStatus: {
      fontSize: 10,
      color: theme.success,
      fontWeight: '600',
    },

    // ── Opponent / invite section ───────────────────────────────────
    inviteRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 10,
      alignItems: 'center',
    },
    inviteInputWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
      height: 48,
    },
    inviteInput: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      marginLeft: 8,
      letterSpacing: 2,
    },
    inviteBtn: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      height: 48,
      paddingHorizontal: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inviteBtnText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.5,
    },

    // ── Nearby players ──────────────────────────────────────────────
    nearbyCard: {
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
    },
    nearbyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    nearbyTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 1,
      marginLeft: 7,
    },
    nearbyCount: {
      fontSize: 11,
      color: theme.success,
      fontWeight: '700',
      marginLeft: 'auto',
    },
    playerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    playerAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      marginRight: 10,
    },
    playerInfo: {
      flex: 1,
    },
    playerName: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
    },
    playerMeta: {
      fontSize: 10,
      color: theme.subText,
      marginTop: 1,
    },
    addBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1.5,
      borderColor: theme.primary,
      backgroundColor: theme.primary + '1A',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addBtnAdded: {
      backgroundColor: theme.success,
      borderColor: theme.success,
    },

    // ── Selected players chips ──────────────────────────────────────
    selectedPlayersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 8,
      marginTop: 10,
    },
    playerChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '1A',
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 20,
      paddingLeft: 8,
      paddingRight: 10,
      paddingVertical: 5,
    },
    playerChipText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.primary,
      marginLeft: 4,
    },

    // ── Notifications toggle ────────────────────────────────────────
    notifRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
    },
    notifIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: theme.info + '18',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    notifTextWrap: {
      flex: 1,
    },
    notifTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
    },
    notifSub: {
      fontSize: 10,
      color: theme.subText,
      marginTop: 2,
    },
    switch: {
      transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },

    // ── Start button ────────────────────────────────────────────────
    startBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 20,
      height: 58,
      borderRadius: 16,
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 10,
    },
    startBtnDisabled: {
      backgroundColor: theme.border,
      shadowOpacity: 0,
    },
    startBtnText: {
      fontSize: 16,
      fontWeight: '900',
      color: '#fff',
      letterSpacing: 1,
      marginLeft: 8,
    },

    // ── Info / helper box ───────────────────────────────────────────
    infoBox: {
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: theme.info + '12',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.info + '40',
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      flex: 1,
      fontSize: 11,
      color: theme.subText,
      lineHeight: 16,
      marginLeft: 8,
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
      borderColor: theme.primary,
    },
    headerTitleText: {
      fontSize: 19,
      fontWeight: '900',
      color: theme.text,
      letterSpacing: 1,
    },
    headerTitleAccent: {
      color: theme.primary,
    },
  });
