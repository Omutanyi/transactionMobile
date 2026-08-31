import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';
import { ProfileScreenContainer, ProfileSection, ProfileField, ProfileMenuRow } from './ProfileComponents';

const PersonalInfo: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;

  return (
    <ProfileScreenContainer>
      <ProfileSection title="Basic Information" icon="person-outline">
        <ProfileField icon="person-outline" label="Full Name" value="John Doe" />
        <ProfileField icon="at-outline" label="Username" value="@johndoe" />
        <ProfileField icon="mail-outline" label="Email" value="john.doe@example.com" />
        <ProfileField icon="call-outline" label="Phone" value="+1 (555) 123-4567" />
        <ProfileField icon="calendar-outline" label="Date of Birth" value="January 1, 1998" showDivider={false} />
      </ProfileSection>

      <ProfileSection title="Identity" icon="shield-checkmark-outline">
        <ProfileField icon="finger-print-outline" label="Player ID" value="PG-284-937" />
        <ProfileField
          icon="checkmark-done-circle-outline"
          label="Account Status"
          value="Verified"
          showDivider={false}
        />
      </ProfileSection>

      <ProfileSection title="Preferences" icon="options-outline">
        <ProfileMenuRow
          icon="language-outline"
          label="Language"
          value="English"
          onPress={() => {}}
        />
        <ProfileMenuRow
          icon="flag-outline"
          label="Country"
          value="United States"
          onPress={() => {}}
          showDivider={false}
        />
      </ProfileSection>

      <ProfileSection title="Edit Profile" icon="create-outline">
        <ProfileMenuRow
          icon="pencil-outline"
          label="Edit My Profile"
          onPress={() => navigation.navigate('EditProfile')}
          showDivider={false}
        />
      </ProfileSection>
    </ProfileScreenContainer>
  );
};

export default PersonalInfo;
