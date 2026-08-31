import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';
import { ProfileScreenContainer, ProfileSection, ProfileToggleRow, BadgePill } from './ProfileComponents';

interface NotificationItem {
  id: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  time: string;
  unread: boolean;
  accentColor: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    icon: 'trophy',
    title: 'Tournament Win',
    message: 'Congratulations! You won the Pro League Cup.',
    time: '2 min ago',
    unread: true,
    accentColor: '#D4AF37',
  },
  {
    id: 2,
    icon: 'game-controller',
    title: 'Match Invite',
    message: 'AceBlaze invited you to a 1v1 match.',
    time: '25 min ago',
    unread: true,
    accentColor: '#5AC8FA',
  },
  {
    id: 3,
    icon: 'people',
    title: 'New Follower',
    message: 'NovaQueen started following you.',
    time: '1 hour ago',
    unread: false,
    accentColor: '#30D158',
  },
  {
    id: 4,
    icon: 'cash',
    title: 'Payment Received',
    message: 'You received $25.00 from ShadowX.',
    time: '2 hours ago',
    unread: false,
    accentColor: '#FF9500',
  },
  {
    id: 5,
    icon: 'alert-circle',
    title: 'Account Security',
    message: 'New login detected from a new device.',
    time: '1 day ago',
    unread: false,
    accentColor: '#FF6B6B',
  },
];

const Notifications: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [tournamentAlerts, setTournamentAlerts] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggleRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <ProfileScreenContainer>
      <ProfileSection title="Notification Preferences" icon="settings-outline">
        <ProfileToggleRow
          icon="notifications"
          title="Push Notifications"
          subtitle="Enable all notifications"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <ProfileToggleRow
          icon="game-controller-outline"
          title="Match Alerts"
          subtitle="Get notified about match updates"
          value={matchAlerts}
          onValueChange={setMatchAlerts}
        />
        <ProfileToggleRow
          icon="trophy-outline"
          title="Tournament Alerts"
          subtitle="Updates on tournaments you join"
          value={tournamentAlerts}
          onValueChange={setTournamentAlerts}
        />
        <ProfileToggleRow
          icon="people-outline"
          title="Friend Activity"
          subtitle="See what your friends are doing"
          value={friendActivity}
          onValueChange={setFriendActivity}
        />
        <ProfileToggleRow
          icon="pricetag-outline"
          title="Promotions & Offers"
          subtitle="Deals and special offers"
          value={promoOffers}
          onValueChange={setPromoOffers}
          showDivider={false}
        />
      </ProfileSection>

      <ProfileSection title="Recent Notifications" icon="notifications-circle-outline">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <BadgePill label={`${unreadCount} UNREAD`} color={theme.primary} outlined />
            )}
          </View>
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '600' }}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        {notifications.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            onPress={() => toggleRead(item.id)}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: index === notifications.length - 1 ? 0 : 1,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: item.accentColor + '1A',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name={item.icon} size={18} color={item.accentColor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 13,
                    fontWeight: item.unread ? 'bold' : '600',
                  }}
                >
                  {item.title}
                </Text>
                {item.unread && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.primary,
                      marginLeft: 6,
                    }}
                  />
                )}
              </View>
              <Text style={{ color: theme.subText, fontSize: 12, marginTop: 2 }} numberOfLines={2}>
                {item.message}
              </Text>
              <Text style={{ color: theme.subText, fontSize: 10, marginTop: 4 }}>
                {item.time}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={theme.subText} />
          </TouchableOpacity>
        ))}
      </ProfileSection>
    </ProfileScreenContainer>
  );
};

export default Notifications;
