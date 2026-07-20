import React, { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppTheme } from '../theme';
import { request } from '../requests';
import apis from '../api';
import { setUser } from '../redux/userReducer';
import SocialAuthRow, { SocialProvider } from '../components/input/SocialAuthRow';
import { createStyles } from './LoginScreen.styles';

const REMEMBER_KEY = 'rememberedIdentifier';

interface Props {
  navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme() as AppTheme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top, insets.bottom);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Prefill a remembered identifier on mount.
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setIdentifier(saved);
        setRemember(true);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      setError('Please enter your email/username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // The field accepts either an email or a username — send both so the
      // backend can match on whichever it supports.
      const isEmail = identifier.includes('@');
      const data = await request(apis.login, {
        method: 'POST',
        body: JSON.stringify({
          email: isEmail ? identifier.trim() : '',
          username: isEmail ? '' : identifier.trim(),
          password,
        }),
      });

      if (data?.token) {
        await AsyncStorage.setItem('jwt', data.token);
        if (remember) {
          await AsyncStorage.setItem(REMEMBER_KEY, identifier.trim());
        } else {
          await AsyncStorage.removeItem(REMEMBER_KEY);
        }

        const profile = await request(apis.getProfile, {
          method: 'GET',
          headers: { Authorization: `Bearer ${data.token}` },
        });
        // Updating redux switches MainNavigator to the appropriate dashboard.
        dispatch(
          setUser({
            email: profile?.Email,
            username: profile?.Username,
            role: profile?.role?.RoleName,
            ...profile,
          })
        );
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (e: any) {
      setError(e?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider: SocialProvider) => {
    setError(`${provider[0].toUpperCase()}${provider.slice(1)} login is coming soon.`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoBadge}>
            <Ionicons name="game-controller" size={48} color={theme.primary} />
          </View>
          <Text style={styles.brandName}>
            PRO<Text style={{ color: theme.info }}>GAMER</Text>
          </Text>
          <Text style={styles.brandTagline}>LEVEL UP YOUR GAME</Text>
        </View>

        {/* Identifier */}
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            placeholderTextColor={theme.subText}
            value={identifier}
            onChangeText={setIdentifier}
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

        {/* Remember / Forgot */}
        <View style={styles.metaRow}>
          <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember((r) => !r)} activeOpacity={0.7}>
            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} hitSlop={8}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" style={styles.chevrons} />
              <Text style={styles.loginButtonText}>LOGIN</Text>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" style={styles.chevrons} />
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
        <SocialAuthRow layout="grid" onPress={handleSocial} />

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} hitSlop={8}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
