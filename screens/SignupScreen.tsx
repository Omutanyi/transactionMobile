import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppTheme } from '../theme';
import { request } from '../requests';
import apis from '../api';
import SocialAuthRow, { SocialProvider } from '../components/input/SocialAuthRow';
import { createStyles } from './SignupScreen.styles';

interface Props {
  navigation: any;
}

const GAME_OPTIONS = ['Valorant', 'EA FC 24', 'Call of Duty', 'Apex Legends', 'Fortnite', 'NBA 2K', 'Rocket League'];

type GamingLevel = 'Casual' | 'Competitive' | 'Pro';

// Returns a 0–4 score plus a label/color for the password strength meter.
const evaluatePassword = (pw: string, theme: AppTheme) => {
  if (!pw) return { score: 0, label: '', color: theme.error };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Weak', color: theme.error },
    { label: 'Weak', color: theme.error },
    { label: 'Fair', color: theme.warning },
    { label: 'Good', color: theme.info },
    { label: 'Strong', color: theme.success },
  ];
  return { score, ...map[score] };
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top, insets.bottom);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [favoriteGame, setFavoriteGame] = useState(GAME_OPTIONS[0]);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const [level, setLevel] = useState<GamingLevel>('Competitive');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => evaluatePassword(password, theme), [password, theme]);

  // Lightweight client-side availability hint. (No dedicated backend endpoint
  // exists yet — the real check happens on submit; this just guides the user.)
  // Usernames may contain any non-whitespace characters, including emoji.
  const usernameAvailable = username.trim().length >= 3 && !/\s/.test(username);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Drive the progress bar / "% COMPLETE" from required fields.
  const completion = useMemo(() => {
    const checks = [
      !!fullName.trim(),
      usernameAvailable,
      emailValid,
      strength.score >= 2,
      confirm.length > 0 && confirm === password,
      agreed,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [fullName, usernameAvailable, emailValid, strength.score, confirm, password, agreed]);

  const levels: { key: GamingLevel; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { key: 'Casual', icon: 'ribbon', color: theme.rankBronze },
    { key: 'Competitive', icon: 'shield', color: theme.rankSilver },
    { key: 'Pro', icon: 'trophy', color: theme.rankGold },
  ];

  const handleSignup = async () => {
    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!usernameAvailable) return setError('Username must be at least 3 characters with no spaces.');
    if (!emailValid) return setError('Please enter a valid email address.');
    if (strength.score < 2) return setError('Please choose a stronger password.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!agreed) return setError('You must agree to the Terms of Service and Privacy Policy.');

    setError('');
    setLoading(true);
    try {
      await request(apis.signup, {
        method: 'POST',
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          password,
          favoriteGame,
          gamingLevel: level,
          role: 'psp',
        }),
      });
      navigation.navigate('Login');
    } catch (e: any) {
      setError(e?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider: SocialProvider) => {
    setError(`${provider[0].toUpperCase()}${provider.slice(1)} sign up is coming soon.`);
  };

  const steps = [
    { num: 1, label: 'PERSONAL INFO' },
    { num: 2, label: 'GAMING PROFILE' },
    { num: 3, label: 'VERIFY' },
  ];
  const activeStep = 1;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Top progress */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.topProgressWrap}>
            <Text style={styles.stepCountText}>STEP {activeStep} OF {steps.length}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(completion, 4)}%` }]} />
            </View>
          </View>
          <View style={styles.completeBadge}>
            <Ionicons name="game-controller" size={16} color={theme.primary} style={{ marginRight: 6 }} />
            <View>
              <Text style={styles.completePercent}>{completion}%</Text>
              <Text style={styles.completeText}>COMPLETE</Text>
            </View>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>CREATE ACCOUNT</Text>
        <Text style={styles.subHeading}>JOIN THE ULTIMATE GAMING COMMUNITY</Text>

        {/* Stepper */}
        <View style={styles.stepper}>
          {steps.map((s, i) => {
            const isActive = s.num === activeStep;
            const accent = isActive ? theme.info : theme.border;
            return (
              <React.Fragment key={s.num}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, { borderColor: accent }]}>
                    <Text style={[styles.stepNumber, { color: isActive ? theme.info : theme.subText }]}>{s.num}</Text>
                  </View>
                  <Text style={[styles.stepLabel, { color: isActive ? theme.info : theme.subText }]}>{s.label}</Text>
                </View>
                {i < steps.length - 1 && <View style={styles.stepConnector} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* Full name */}
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={theme.subText}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Username */}
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.subText}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {username.length > 0 && usernameAvailable && (
            <View style={styles.availableRow}>
              <Ionicons name="checkmark-circle" size={18} color={theme.success} />
              <Text style={[styles.availableText, { color: theme.success }]}>Available!</Text>
            </View>
          )}
        </View>

        {/* Email */}
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={theme.subText}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>
        {password.length > 0 && (
          <View style={styles.strengthBlock}>
            <View style={styles.strengthSegments}>
              {[0, 1, 2, 3].map((seg) => (
                <View
                  key={seg}
                  style={[styles.strengthSegment, seg < strength.score && { backgroundColor: strength.color }]}
                />
              ))}
            </View>
            <Text style={styles.strengthLabel}>
              Password strength: <Text style={{ color: strength.color, fontWeight: '700' }}>{strength.label}</Text>
            </Text>
          </View>
        )}

        {/* Confirm password */}
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.subText}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
          />
          {confirm.length > 0 && (
            <Ionicons
              name={confirm === password ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={confirm === password ? theme.success : theme.error}
              style={{ marginRight: 6 }}
            />
          )}
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm((s) => !s)} hitSlop={8}>
            <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>

        {/* Gaming preferences */}
        <View style={styles.sectionLabelRow}>
          <Ionicons name="game-controller" size={18} color={theme.info} />
          <Text style={styles.sectionLabel}>GAMING PREFERENCES</Text>
        </View>

        <View style={styles.prefRow}>
          {/* Favorite game */}
          <View style={styles.prefCol}>
            <Text style={styles.prefHeading}>Favorite Game</Text>
            <TouchableOpacity style={styles.gameSelect} onPress={() => setGameMenuOpen((o) => !o)} activeOpacity={0.8}>
              <Text style={styles.gameSelectText}>{favoriteGame}</Text>
              <Ionicons name={gameMenuOpen ? 'chevron-up' : 'chevron-down'} size={18} color={theme.subText} />
            </TouchableOpacity>
          </View>

          {/* Gaming level */}
          <View style={styles.prefCol}>
            <Text style={styles.prefHeading}>Gaming Level</Text>
            <View style={styles.levelRow}>
              {levels.map((l) => {
                const active = level === l.key;
                return (
                  <TouchableOpacity
                    key={l.key}
                    style={[styles.levelItem, active && styles.levelItemActive]}
                    onPress={() => setLevel(l.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={l.icon} size={22} color={l.color} />
                    <Text style={[styles.levelLabel, active && styles.levelLabelActive]}>{l.key}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {gameMenuOpen && (
          <View style={styles.gameMenu}>
            {GAME_OPTIONS.map((g, idx) => (
              <TouchableOpacity
                key={g}
                style={[styles.gameMenuItem, idx === GAME_OPTIONS.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  setFavoriteGame(g);
                  setGameMenuOpen(false);
                }}
              >
                <Text style={[styles.gameMenuItemText, { color: g === favoriteGame ? theme.info : theme.text, fontWeight: g === favoriteGame ? '700' : '400' }]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed((a) => !a)} activeOpacity={0.7}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink} onPress={() => navigation.navigate('TermsAndConditions')}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink} onPress={() => navigation.navigate('TermsAndConditions')}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSignup} activeOpacity={0.85} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>CREATE ACCOUNT</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social */}
        <SocialAuthRow layout="inline" onPress={handleSocial} />

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} hitSlop={8}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
