import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';
import { ProfileScreenContainer, ProfileSection, ProfileMenuRow } from './ProfileComponents';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: 'How do I start playing?',
    answer: 'Create an account, verify your email, and you can start joining matches and tournaments right away.',
  },
  {
    id: 2,
    question: 'How do I earn RP (Rank Points)?',
    answer: 'You earn RP by winning matches and tournaments. Higher-level wins give you more RP.',
  },
  {
    id: 3,
    question: 'How do I join a tournament?',
    answer: 'Go to the Tournaments tab, browse available tournaments, and tap "Join" on any you are interested in.',
  },
  {
    id: 4,
    question: 'How do I withdraw my winnings?',
    answer: 'You can withdraw your winnings via the Payment section in your Account settings. Withdrawals take 1-3 business days.',
  },
  {
    id: 5,
    question: 'How can I find friends?',
    answer: 'Use the Community tab to discover other players, follow them, and see their activity in your feed.',
  },
];

const SUPPORT_OPTIONS: { id: string; icon: IconName; label: string; description: string; color: string }[] = [
  { id: 'chat', icon: 'chatbubbles', label: 'Live Chat', description: 'Chat with support', color: '#30D158' },
  { id: 'email', icon: 'mail', label: 'Email Us', description: 'support@progamer.com', color: '#5AC8FA' },
  { id: 'phone', icon: 'call', label: 'Call Us', description: '+1 (555) 123-4567', color: '#FF9500' },
  { id: 'faq', icon: 'help-circle', label: 'FAQ', description: 'Find quick answers', color: '#6C3CE1' },
];

const Help: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <ProfileScreenContainer>
      <ProfileSection title="Support" icon="headset-outline">
        {SUPPORT_OPTIONS.map((opt, index) => (
          <TouchableOpacity
            key={opt.id}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: index === SUPPORT_OPTIONS.length - 1 ? 0 : 1,
              borderBottomColor: theme.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: opt.color + '1A',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name={opt.icon} size={18} color={opt.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{opt.label}</Text>
              <Text style={{ color: theme.subText, fontSize: 12, marginTop: 2 }}>{opt.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={15} color={theme.subText} />
          </TouchableOpacity>
        ))}
      </ProfileSection>

      <ProfileSection title="Frequently Asked Questions" icon="help-circle-outline">
        {FAQ_ITEMS.map((item, index) => {
          const expanded = expandedIds.includes(item.id);
          return (
            <View
              key={item.id}
              style={{
                borderBottomWidth: index === FAQ_ITEMS.length - 1 ? 0 : 1,
                borderBottomColor: theme.border,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => toggleFaq(item.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>
                    {item.question}
                  </Text>
                </View>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={theme.subText}
                />
              </TouchableOpacity>
              {expanded && (
                <Text
                  style={{
                    color: theme.subText,
                    fontSize: 13,
                    lineHeight: 19,
                    paddingBottom: 12,
                    paddingRight: 12,
                  }}
                >
                  {item.answer}
                </Text>
              )}
            </View>
          );
        })}
      </ProfileSection>

      <ProfileSection title="Legal" icon="document-text-outline">
        <ProfileMenuRow
          icon="document-outline"
          label="Terms of Service"
          onPress={() => navigation.navigate('TermsAndConditions')}
        />
        <ProfileMenuRow
          icon="shield-outline"
          label="Privacy Policy"
          onPress={() => {}}
        />
        <ProfileMenuRow
          icon="information-circle-outline"
          label="About Us"
          onPress={() => {}}
          showDivider={false}
        />
      </ProfileSection>

      <ProfileMenuRow
        icon="logo-github"
        label="Report a Bug"
        onPress={() => {}}
        accentColor={theme.error}
        showDivider={false}
      />
    </ProfileScreenContainer>
  );
};

export default Help;
