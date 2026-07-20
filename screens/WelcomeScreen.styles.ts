import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

export const createStyles = (theme: AppTheme, topInset: number = 0, bottomInset: number = 0) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // ── Top bar (Skip) ───────────────────────────────────────────
    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: topInset + 8,
      height: topInset + 44,
    },
    skipBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    skipText: {
      fontSize: 16,
      color: theme.subText,
      fontWeight: '600',
      marginRight: 2,
    },

    // ── Slide ────────────────────────────────────────────────────
    slide: {
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    heroWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 28,
    },
    heroGlow: {
      width: 200,
      height: 200,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card,
      borderWidth: 2,
      borderColor: theme.secondary,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 30,
      elevation: 16,
    },
    appName: {
      fontSize: 40,
      fontWeight: 'bold',
      letterSpacing: 1,
      color: theme.text,
    },
    tagline: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.subText,
      marginTop: 6,
      marginBottom: 30,
      letterSpacing: 0.5,
    },

    // ── Feature cards row ────────────────────────────────────────
    featureRow: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    featureCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1.5,
      paddingVertical: 18,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    featureIconWrap: {
      marginBottom: 10,
    },
    featureLabel: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      lineHeight: 17,
    },
    featureUnderline: {
      width: 26,
      height: 3,
      borderRadius: 2,
      marginTop: 8,
    },

    // ── Dots ─────────────────────────────────────────────────────
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 28,
      marginBottom: 20,
    },
    dot: {
      height: 9,
      borderRadius: 5,
      marginHorizontal: 4,
    },

    // ── Bottom CTA ───────────────────────────────────────────────
    footer: {
      paddingHorizontal: 24,
      paddingBottom: bottomInset + 16,
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
    ctaText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 0.5,
      marginRight: 8,
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 18,
    },
    loginRowText: {
      fontSize: 14,
      color: theme.subText,
    },
    loginRowLink: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: 'bold',
    },
  });
