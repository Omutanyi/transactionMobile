import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';
import { ProfileScreenContainer, ProfileSection, ProfileMenuRow, BadgePill } from './ProfileComponents';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SavedLocation {
  id: number;
  icon: IconName;
  label: string;
  address: string;
  isHome?: boolean;
  isWork?: boolean;
}

const SAVED_LOCATIONS: SavedLocation[] = [
  { id: 1, icon: 'home', label: 'Home', address: '123 Main Street, Springfield', isHome: true },
  { id: 2, icon: 'briefcase', label: 'Work', address: '456 Business Avenue, Metropolis', isWork: true },
  { id: 3, icon: 'location', label: 'Gaming Cafe', address: '789 Gamer Lane, Arcadia' },
];

const Location: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;

  const [locationEnabled, setLocationEnabled] = useState(true);
  const [region, setRegion] = useState('North America');
  const [timeZone, setTimeZone] = useState('Eastern Time (ET)');

  return (
    <ProfileScreenContainer>
      <ProfileSection title="Current Location" icon="navigate-circle-outline">
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: theme.primary + '1A',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="location" size={22} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>
              New York, NY
            </Text>
            <Text style={{ color: theme.subText, fontSize: 12, marginTop: 2 }}>
              United States
            </Text>
          </View>
          <BadgePill label="DETECTED" color={theme.success} />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary,
            borderRadius: 10,
            paddingVertical: 10,
          }}
        >
          <Ionicons name="locate-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Update My Location</Text>
        </TouchableOpacity>
      </ProfileSection>

      <ProfileSection title="Saved Places" icon="bookmark-outline">
        {SAVED_LOCATIONS.map((loc, index) => (
          <TouchableOpacity
            key={loc.id}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: index === SAVED_LOCATIONS.length - 1 ? 0 : 1,
              borderBottomColor: theme.border,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: (loc.isHome ? theme.success : loc.isWork ? theme.info : theme.primary) + '1A',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Ionicons
                name={loc.icon}
                size={18}
                color={loc.isHome ? theme.success : loc.isWork ? theme.info : theme.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{loc.label}</Text>
              <Text style={{ color: theme.subText, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                {loc.address}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={theme.subText} />
          </TouchableOpacity>
        ))}
      </ProfileSection>

      <ProfileSection title="Region Settings" icon="globe-outline">
        <ProfileMenuRow
          icon="flag-outline"
          label="Region"
          value={region}
          onPress={() => {}}
        />
        <ProfileMenuRow
          icon="time-outline"
          label="Time Zone"
          value={timeZone}
          onPress={() => {}}
          showDivider={false}
        />
      </ProfileSection>

      <ProfileSection title="Location Permissions" icon="shield-outline">
        <ProfileMenuRow
          icon="navigate-outline"
          label="Allow Location Access"
          value="Enabled"
          onPress={() => {}}
          accentColor={theme.success}
        />
        <ProfileMenuRow
          icon="map-outline"
          label="Background Location"
          value="Off"
          onPress={() => {}}
          showDivider={false}
          accentColor={theme.subText}
        />
      </ProfileSection>
    </ProfileScreenContainer>
  );
};

export default Location;
