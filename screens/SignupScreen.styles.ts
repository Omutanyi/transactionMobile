import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

export const createStyles = (theme: AppTheme, topInset: number = 0, bottomInset: number = 0) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: topInset + 8,
      paddingBottom: bottomInset + 32,
    },

    // ── Top progress bar ─────────────────────────────────────────
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
    },
    backBtn: {
      padding: 4,
      marginRight: 12,
    },
    topProgressWrap: {
      flex: 1,
    },
    stepCountText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      color: theme.info,
      textAlign: 'center',
      marginBottom: 6,
    },
    progressTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: theme.info,
    },
    completeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
      backgroundColor: theme.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    completeText: {
      fontSize: 9,
      color: theme.subText,
      fontWeight: '700',
    },
    completePercent: {
      fontSize: 13,
      color: theme.text,
      fontWeight: 'bold',
    },

    // ── Heading ──────────────────────────────────────────────────
    heading: {
      fontSize: 34,
      fontWeight: 'bold',
      color: theme.info,
      textAlign: 'center',
      letterSpacing: 1,
    },
    subHeading: {
      fontSize: 13,
      color: theme.subText,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 22,
      letterSpacing: 1,
    },

    // ── Stepper ──────────────────────────────────────────────────
    stepper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginBottom: 26,
    },
    stepItem: {
      alignItems: 'center',
      width: 86,
    },
    stepCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumber: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    stepLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginTop: 6,
      textAlign: 'center',
    },
    stepConnector: {
      height: 2,
      flex: 1,
      backgroundColor: theme.border,
      marginTop: 21,
      marginHorizontal: -10,
    },

    // ── Inputs ───────────────────────────────────────────────────
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 14,
      minHeight: 56,
      marginBottom: 14,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: theme.inputText,
      fontSize: 15,
    },
    eyeBtn: {
      padding: 4,
    },
    availableRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    availableText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },

    // ── Password strength ────────────────────────────────────────
    strengthBlock: {
      marginTop: -6,
      marginBottom: 14,
    },
    strengthSegments: {
      flexDirection: 'row',
      gap: 6,
    },
    strengthSegment: {
      flex: 1,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.border,
    },
    strengthLabel: {
      fontSize: 11,
      color: theme.subText,
      marginTop: 6,
    },

    // ── Section label ────────────────────────────────────────────
    sectionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 14,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.info,
      letterSpacing: 1,
      marginLeft: 8,
    },

    // ── Preference grids ─────────────────────────────────────────
    prefRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 18,
    },
    prefCol: {
      flex: 1,
    },
    prefHeading: {
      fontSize: 13,
      color: theme.text,
      marginBottom: 8,
    },

    // Favorite game dropdown
    gameSelect: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12,
      height: 64,
    },
    gameSelectText: {
      fontSize: 15,
      color: theme.text,
      fontWeight: '600',
    },
    gameMenu: {
      marginTop: 6,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    gameMenuItem: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    gameMenuItemText: {
      fontSize: 14,
    },

    // Gaming level
    levelRow: {
      flexDirection: 'row',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      padding: 6,
      height: 64,
    },
    levelItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    levelItemActive: {
      borderWidth: 1.5,
      borderColor: theme.info,
      backgroundColor: 'rgba(100,210,255,0.12)',
    },
    levelLabel: {
      fontSize: 10,
      fontWeight: '600',
      marginTop: 2,
      color: theme.subText,
    },
    levelLabelActive: {
      color: theme.text,
    },

    // ── Terms ────────────────────────────────────────────────────
    termsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
    },
    termsText: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      lineHeight: 18,
    },
    termsLink: {
      color: theme.info,
      fontWeight: '600',
    },

    errorText: {
      color: theme.error,
      fontSize: 13,
      marginBottom: 12,
      textAlign: 'center',
    },

    // ── Submit ───────────────────────────────────────────────────
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary,
      borderRadius: 14,
      height: 58,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 18,
      elevation: 12,
    },
    submitButtonText: {
      fontSize: 17,
      fontWeight: 'bold',
      letterSpacing: 1,
      color: '#fff',
      marginRight: 8,
    },

    // ── Divider ──────────────────────────────────────────────────
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 22,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerLabel: {
      marginHorizontal: 14,
      fontSize: 13,
      fontWeight: '700',
      color: theme.subText,
      letterSpacing: 1,
    },

    // ── Footer ───────────────────────────────────────────────────
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 26,
    },
    footerText: {
      fontSize: 14,
      color: theme.subText,
    },
    footerLink: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: 'bold',
    },
  });
