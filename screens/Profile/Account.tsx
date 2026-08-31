import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';
import { ProfileScreenContainer, ProfileSection, ProfileMenuRow, ProfileToggleRow, BadgePill } from './ProfileComponents';

const Account: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;

  // Replace with real state from redux / API later.
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <ProfileScreenContainer>
      <ProfileSection title="Membership" icon="diamond-outline">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.rankGold + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              <Ionicons name="trophy" size={18} color={theme.rankGold} />
            </View>
            <View>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>ProGamer Plus</Text>
              <Text style={{ color: theme.subText, fontSize: 11 }}>Active until Dec 2026</Text>
            </View>
          </View>
          <BadgePill label="ACTIVE" color={theme.success} />
        </View>
      </ProfileSection>

      <ProfileSection title="Preferences" icon="notifications-outline">
        <ProfileToggleRow
          icon="mail-outline"
          title="Email Notifications"
          subtitle="Receive updates via email"
          value={emailAlerts}
          onValueChange={setEmailAlerts}
        />
        <ProfileToggleRow
          icon="chatbubbles-outline"
          title="SMS Alerts"
          subtitle="Get text messages for important events"
          value={smsAlerts}
          onValueChange={setSmsAlerts}
        />
        <ProfileToggleRow
          icon="key-outline"
          title="Two-Factor Authentication"
          subtitle="Extra security for your account"
          value={twoFactor}
          onValueChange={setTwoFactor}
          showDivider={false}
        />
      </ProfileSection>

      <ProfileSection title="Security" icon="shield-checkmark-outline">
        <ProfileMenuRow
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => {}}
        />
        <ProfileMenuRow
          icon="phone-portrait-outline"
          label="Manage Devices"
          value="2 active"
          onPress={() => {}}
        />
        <ProfileMenuRow
          icon="key-outline"
          label="Security Questions"
          onPress={() => {}}
          showDivider={false}
        />
      </ProfileSection>

      <ProfileSection title="Payment & Billing" icon="wallet-outline">
        <ProfileMenuRow
          icon="card-outline"
          label="Payment Methods"
          value="Visa •••• 4242"
          onPress={() => {}}
        />
        <ProfileMenuRow
          icon="receipt-outline"
          label="Billing History"
          onPress={() => {}}
          showDivider={false}
        />
      </ProfileSection>

      <ProfileSection title="Connected Accounts" icon="link-outline">
        <ProfileMenuRow
          icon="logo-google"
          label="Google"
          value="Connected"
          onPress={() => {}}
          accentColor={theme.primary}
        />
        <ProfileMenuRow
          icon="logo-facebook"
          label="Facebook"
          value="Not linked"
          onPress={() => {}}
          accentColor={theme.info}
        />
        <ProfileMenuRow
          icon="logo-twitter"
          label="X (Twitter)"
          value="Not linked"
          onPress={() => {}}
          showDivider={false}
          accentColor={theme.success}
        />
      </ProfileSection>
    </ProfileScreenContainer>
  );
};

export default Account;
