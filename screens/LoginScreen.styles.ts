import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

export const createStyles = (theme: AppTheme, topInset: number = 0, bottomInset: number = 0) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingTop: topInset + 24,
      paddingBottom: bottomInset + 24,
    },

    // ── Brand header ─────────────────────────────────────────────
    brand: {
      alignItems: 'center',
      marginBottom: 36,
    },
    logoBadge: {
      width: 92,
      height: 92,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card,
      borderWidth: 2,
      borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 22,
      elevation: 12,
      marginBottom: 16,
    },
    brandName: {
      fontSize: 38,
      fontWeight: 'bold',
      letterSpacing: 1,
      color: theme.text,
    },
    brandTagline: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 3,
      color: theme.info,
      marginTop: 4,
    },

    // ── Inputs ───────────────────────────────────────────────────
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 14,
      height: 56,
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

    // ── Remember / Forgot row ────────────────────────────────────
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 2,
      marginBottom: 22,
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
    },
    rememberText: {
      fontSize: 14,
      color: theme.text,
    },
    forgotText: {
      fontSize: 14,
      color: theme.info,
      fontWeight: '600',
    },

    errorText: {
      color: theme.error,
      fontSize: 13,
      marginBottom: 12,
      textAlign: 'center',
    },

    // ── Login button ─────────────────────────────────────────────
    loginButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      borderRadius: 14,
      height: 58,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 18,
      elevation: 12,
    },
    loginButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 2,
      color: '#fff',
    },
    chevrons: {
      marginHorizontal: 14,
    },

    // ── Divider ──────────────────────────────────────────────────
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 26,
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

    // ── Social ───────────────────────────────────────────────────
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    socialCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 12,
      alignItems: 'center',
    },
    socialLabel: {
      fontSize: 11,
      color: theme.text,
      fontWeight: '600',
      marginTop: 6,
    },

    // ── Footer ───────────────────────────────────────────────────
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
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
