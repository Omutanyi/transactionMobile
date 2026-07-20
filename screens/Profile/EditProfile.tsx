import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { AvatarImage } from '../../components/StyledComponents';
import { AppTheme } from '../../theme';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/userReducer';
import { request } from '../../requests';
import apis from '../../api';

interface FieldConfig {
  key: 'fullName' | 'username' | 'email' | 'phone' | 'bio';
  label: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  multiline?: boolean;
}

const FIELDS: FieldConfig[] = [
  { key: 'fullName', label: 'Display Name', placeholder: 'Your name', icon: 'person-outline', autoCapitalize: 'words' },
  { key: 'username', label: 'Username', placeholder: 'Choose a username', icon: 'at-outline', autoCapitalize: 'none' },
  { key: 'email', label: 'Email', placeholder: 'you@email.com', icon: 'mail-outline', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'phone', label: 'Phone', placeholder: 'Phone number', icon: 'call-outline', keyboardType: 'phone-pad' },
  { key: 'bio', label: 'Bio', placeholder: 'Tell other players about yourself', icon: 'document-text-outline', multiline: true },
];

const EditProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const initial = useMemo(
    () => ({
      fullName: user.fullName || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
    }),
    [user]
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () => (Object.keys(form) as (keyof typeof form)[]).some((k) => form[k] !== initial[k]),
    [form, initial]
  );

  const setField = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'Please enter your display name.';
    if (form.username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (/\s/.test(form.username)) return 'Username cannot contain spaces.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
    if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) return 'Please enter a valid phone number.';
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Check your details', validationError);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
      };
      await request(apis.updateProfile, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      // Keep redux in sync so the profile screen reflects changes immediately.
      dispatch(setUser(payload));
      Alert.alert('Profile updated', 'Your changes have been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Update failed', e?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (!dirty) {
      navigation.goBack();
      return;
    }
    Alert.alert('Discard changes?', 'You have unsaved changes. Are you sure you want to leave?', [
      { text: 'Keep Editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const handleChangePhoto = () => {
    Alert.alert('Change photo', 'Photo upload is coming soon.');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <AvatarImage
              source={user.avatar ? { uri: user.avatar } : require('../../assets/avatar.jpg')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraBadge} onPress={handleChangePhoto} activeOpacity={0.8}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto}>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        <View style={styles.formCard}>
          {FIELDS.map((field) => (
            <View key={field.key} style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={[styles.inputRow, field.multiline && styles.inputRowMultiline]}>
                <Ionicons name={field.icon} size={18} color={theme.subText} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.input, field.multiline && styles.inputMultiline]}
                  value={form[field.key]}
                  onChangeText={(t) => setField(field.key, t)}
                  placeholder={field.placeholder}
                  placeholderTextColor={theme.subText}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.autoCapitalize}
                  multiline={field.multiline}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Save */}
        <TouchableOpacity
          style={[styles.saveButton, (!dirty || saving) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!dirty || saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleBack} disabled={saving}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.background },
    scroll: { flex: 1, backgroundColor: theme.background },
    avatarSection: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 16,
    },
    avatarRing: {
      width: 104,
      height: 104,
      borderRadius: 52,
      borderWidth: 3,
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      width: 92,
      height: 92,
      borderRadius: 46,
      borderWidth: 0,
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background,
    },
    changePhoto: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
    },
    formCard: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
    },
    fieldBlock: {
      marginBottom: 14,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.subText,
      marginBottom: 6,
      letterSpacing: 0.5,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12,
      minHeight: 50,
    },
    inputRowMultiline: {
      alignItems: 'flex-start',
      paddingVertical: 10,
      minHeight: 90,
    },
    fieldIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: theme.inputText,
      fontSize: 15,
      paddingVertical: 10,
    },
    inputMultiline: {
      textAlignVertical: 'top',
      minHeight: 70,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      marginHorizontal: 16,
      marginTop: 22,
      borderRadius: 14,
      paddingVertical: 16,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 1,
    },
    cancelButton: {
      alignItems: 'center',
      marginTop: 14,
      paddingVertical: 10,
    },
    cancelButtonText: {
      fontSize: 14,
      color: theme.subText,
      fontWeight: '600',
    },
  });

export default EditProfile;
