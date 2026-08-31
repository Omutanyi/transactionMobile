import { StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '../../theme';

const { width } = Dimensions.get('window');

export const GAME_CARD_WIDTH = (width - 32 - 12) / 2;

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 28,
    },

    // ── Step indicator ──────────────────────────────────────────────
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
    },
    step: {
      alignItems: 'center',
      width: 78,
    },
    stepCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: theme.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    stepCircleActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
    stepNumber: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.subText,
    },
    stepNumberActive: {
      color: '#fff',
    },
    stepLabel: {
      fontSize: 8.5,
      fontWeight: '700',
      color: theme.subText,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    stepLabelActive: {
      color: theme.primary,
    },
    stepConnector: {
      height: 2,
      flex: 1,
      backgroundColor: theme.border,
      marginTop: 15,
      marginHorizontal: -16,
    },
    stepConnectorActive: {
      backgroundColor: theme.info,
    },

    // ── Section label ───────────────────────────────────────────────
    sectionLabel: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 1.2,
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 10,
    },

    // ── Game grid ───────────────────────────────────────────────────
    gameGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 12,
    },
    gameCard: {
      width: GAME_CARD_WIDTH,
      height: 86,
      // borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.card,
      // borderWidth: 1.5,
    },
    gameCardSelected: {
      borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 7,
    },
    gameCardImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    gameCardOverlay: {
      ...StyleSheet.absoluteFillObject,
      // backgroundColor: 'rgba(8,10,22,0.55)',
      justifyContent: 'flex-end',
      padding: 8,
    },
    gameCardName: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.3,
    },
    gameCheck: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.7)',
      backgroundColor: 'rgba(0,0,0,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    gameCheckActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },

    // ── Settings form (full width) ──────────────────────────────────
    formSection: {
      paddingHorizontal: 16,
      marginTop: 16,
    },

    // ── Generic field ───────────────────────────────────────────────
    fieldGroup: {
      marginBottom: 14,
    },
    fieldLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 10,
      minHeight: 40,
    },
    input: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      marginLeft: 6,
      paddingVertical: 8,
    },
    inputMultiline: {
      alignItems: 'flex-start',
      minHeight: 64,
    },
    inputMultilineText: {
      textAlignVertical: 'top',
      paddingTop: 8,
    },
    charCount: {
      fontSize: 9,
      color: theme.subText,
      alignSelf: 'flex-end',
      marginTop: 3,
    },

    // ── Tournament type cards ───────────────────────────────────────
    typeRow: {
      flexDirection: 'row',
      gap: 6,
    },
    typeCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: theme.border,
      paddingVertical: 14,
      paddingHorizontal: 6,
      alignItems: 'center',
    },
    typeCardActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '14',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 7,
      elevation: 4,
    },
    typeLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 0.3,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 13,
    },
    typeLabelActive: {
      color: theme.primary,
    },

    // ── Half-width row (prize/entry, max/date) ──────────────────────
    halfRow: {
      flexDirection: 'row',
      gap: 10,
    },
    half: {
      flex: 1,
    },

    // ── Entry fee toggle ────────────────────────────────────────────
    entryToggle: {
      flexDirection: 'row',
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 3,
      height: 40,
    },
    entrySeg: {
      flex: 1,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
    },
    entrySegActive: {
      backgroundColor: theme.primary,
    },
    entryPremiumSegActive: {
      backgroundColor: theme.warning,
    },
    entrySegText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 0.5,
    },
    entrySegTextActive: {
      color: '#fff',
    },

    // ── Stepper value field (max participants) ──────────────────────
    valueField: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 10,
      height: 40,
    },
    valueText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 6,
    },
    dateText: {
      flex: 1,
      fontSize: 11,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 6,
    },

    // ── Preview card (collapsible) ──────────────────────────────────
    previewExpand: {
      paddingHorizontal: 16,
      marginTop: 6,
    },
    previewCard: {
      backgroundColor: theme.statCard,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.info + '55',
      padding: 16,
    },
    previewHeaderLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.info,
      letterSpacing: 1,
      textAlign: 'center',
      marginBottom: 10,
    },
    previewTrophyWrap: {
      alignSelf: 'center',
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: theme.info + '1F',
      borderWidth: 1,
      borderColor: theme.info + '66',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    previewTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.text,
      textAlign: 'center',
      letterSpacing: 0.5,
      marginBottom: 14,
    },
    previewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 11,
    },
    previewRowIcon: {
      width: 20,
      alignItems: 'center',
      marginRight: 8,
    },
    previewLabel: {
      fontSize: 12,
      color: theme.subText,
      flex: 1,
    },
    previewValue: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
      maxWidth: '58%',
      textAlign: 'right',
    },
    previewValueAccent: {
      color: theme.info,
    },
    previewDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 8,
    },
    previewDescLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.subText,
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    previewDesc: {
      fontSize: 12,
      color: theme.text,
      lineHeight: 17,
    },

    // ── Tournament rules row ────────────────────────────────────────
    rulesCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 6,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
    },
    rulesIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: theme.info + '18',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    rulesTextWrap: {
      flex: 1,
    },
    rulesTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
    },
    rulesSub: {
      fontSize: 10,
      color: theme.subText,
      marginTop: 2,
    },
    rulesExpand: {
      paddingHorizontal: 16,
      paddingBottom: 4,
    },
    ruleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginTop: 6,
      backgroundColor: theme.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    ruleItemText: {
      flex: 1,
      fontSize: 12,
      color: theme.text,
      marginLeft: 8,
    },

    // ── Create button ───────────────────────────────────────────────
    createBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 20,
      height: 58,
      borderRadius: 16,
      backgroundColor: theme.primary,
      // borderWidth: 1.5,
      // borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 10,
    },
    createBtnText: {
      fontSize: 17,
      fontWeight: '900',
      color: '#fff',
      letterSpacing: 1,
      marginLeft: 9,
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
