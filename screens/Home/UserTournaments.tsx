import React, { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles, getHeaderOptions, RANK_COLORS, RankKey } from './UserTournaments.styles';
import AppLogo from '../../components/AppLogo';
import TournamentDetails from '../Tournaments/TournamentDetails';

const Stack = createStackNavigator();

// ── Static data ───────────────────────────────────────────────────

const CATEGORIES: { id: string; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'fps', label: 'FPS', icon: 'radio-button-on-outline' },
  { id: 'moba', label: 'MOBA', icon: 'people-outline' },
  { id: 'sports', label: 'Sports', icon: 'football-outline' },
  { id: 'strategy', label: 'Strategy', icon: 'bulb-outline' },
];

interface Tournament {
  id: number;
  name: string;
  game: string;
  category: string;
  prize: number;
  entryFee: number;
  players: number;
  maxPlayers: number;
  date: string;
  rank: RankKey;
  image: any;
}

const TOURNAMENTS: Tournament[] = [
  {
    id: 1, name: 'Valorant Showdown', game: 'Valorant', category: 'fps',
    prize: 2500, entryFee: 10, players: 128, maxPlayers: 256,
    date: 'Today, 8:00 PM', rank: 'BRONZE',
    image: require('../../assets/gaming.jpg'),
  },
  {
    id: 2, name: 'FIFA Mobile Cup', game: 'FIFA Mobile', category: 'sports',
    prize: 1500, entryFee: 5, players: 96, maxPlayers: 192,
    date: 'Tomorrow, 6:00 PM', rank: 'SILVER',
    image: require('../../assets/profile.jpg'),
  },
  {
    id: 3, name: 'CODM Elite Cup', game: 'Call of Duty', category: 'fps',
    prize: 2000, entryFee: 8, players: 200, maxPlayers: 256,
    date: 'May 25, 7:00 PM', rank: 'GOLD',
    image: require('../../assets/avatar.jpg'),
  },
  {
    id: 4, name: 'League Champions', game: 'League of Legends', category: 'moba',
    prize: 3000, entryFee: 15, players: 64, maxPlayers: 128,
    date: 'May 26, 4:00 PM', rank: 'GOLD',
    image: require('../../assets/icon.png'),
  },
  {
    id: 5, name: 'NBA 2K Pro Cup', game: 'NBA 2K24', category: 'sports',
    prize: 1000, entryFee: 5, players: 48, maxPlayers: 64,
    date: 'May 27, 8:00 PM', rank: 'BRONZE',
    image: require('../../assets/gaming.jpg'),
  },
];

// ── Content Screen ─────────────────────────────────────────────────

const UserTournamentsContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [countdown, setCountdown] = useState({ days: 2, hrs: 14, mins: 32, secs: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hrs, mins, secs } = prev;
        if (days === 0 && hrs === 0 && mins === 0 && secs === 0) return prev;
        secs -= 1;
        if (secs < 0) { secs = 59; mins -= 1; }
        if (mins < 0) { mins = 59; hrs -= 1; }
        if (hrs < 0) { hrs = 23; days -= 1; }
        return { days, hrs, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered = selectedCategory === 'all'
    ? TOURNAMENTS
    : TOURNAMENTS.filter(t => t.category === selectedCategory);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

      {/* ── Category Chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(cat => {
          const active = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Ionicons name={cat.icon} size={14} color={active ? '#fff' : theme.subText} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Featured Tournament ── */}
      <TouchableOpacity
        style={styles.featuredCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('TournamentDetails', {
          tournament: {
            name: 'Neon Championship', game: 'Valorant', prize: 5000,
            entryFee: 10, players: 32, maxPlayers: 64,
            image: require('../../assets/gaming.jpg'),
          },
        })}
      >
        <Image
          source={require('../../assets/gaming.jpg')}
          style={styles.featuredBg}
          resizeMode="cover"
        />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <View style={styles.badgesRow}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>★ FEATURED</Text>
            </View>
            <View style={styles.liveSoonBadge}>
              <View style={styles.liveSoonDot} />
              <Text style={styles.liveSoonText}>LIVE SOON</Text>
            </View>
          </View>

          <Text style={styles.featuredTitle}>Neon Championship</Text>
          <Text style={styles.featuredSubtitle}>The ultimate battle for glory!</Text>

          <Text style={styles.prizePoolLabel}>PRIZE POOL</Text>
          <Text style={styles.featuredPrize}>$5,000</Text>

          <View style={styles.countdownRow}>
            {[
              { value: countdown.days, unit: 'DAYS' },
              { value: countdown.hrs, unit: 'HRS' },
              { value: countdown.mins, unit: 'MINS' },
              { value: countdown.secs, unit: 'SECS' },
            ].map((item, i) => (
              <React.Fragment key={item.unit}>
                {i > 0 && <Text style={styles.countdownSep}>:</Text>}
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownValue}>{pad(item.value)}</Text>
                  <Text style={styles.countdownUnit}>{item.unit}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>
      </TouchableOpacity>

      {/* ── All Tournaments header ── */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="trophy-outline" size={16} color={theme.primary} />
          <Text style={styles.sectionTitle}>All Tournaments</Text>
        </View>
        <TouchableOpacity style={styles.viewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Tournament Cards ── */}
      {filtered.map(t => (
        <TouchableOpacity
          key={t.id}
          style={styles.tournamentCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('TournamentDetails', { tournament: t })}
        >
          {/* Left: game image + rank badge */}
          <View style={styles.cardImageWrapper}>
            <Image source={t.image} style={styles.cardImage} resizeMode="cover" />
            <View style={[styles.rankBadge, { backgroundColor: RANK_COLORS[t.rank] }]}>
              <Text style={styles.rankBadgeText}>{t.rank}</Text>
            </View>
          </View>

          {/* Middle: name, prize, players */}
          <View style={styles.cardBody}>
            <Text style={styles.cardName} numberOfLines={1}>{t.name}</Text>
            <View style={styles.cardPrizeRow}>
              <View style={styles.dollarBadge}>
                <Text style={styles.dollarBadgeText}>$</Text>
              </View>
              <Text style={styles.cardPrize}>{t.prize.toLocaleString()}</Text>
            </View>
            <View style={styles.cardPlayersRow}>
              <Ionicons name="people-outline" size={12} color={theme.subText} />
              <Text style={styles.cardPlayersText}>{t.players} / {t.maxPlayers}</Text>
            </View>
          </View>

          {/* Right: date, entry fee, join button */}
          <View style={styles.cardRight}>
            <View style={styles.cardDateRow}>
              <Ionicons name="calendar-outline" size={11} color={theme.subText} />
              <Text style={styles.cardDateText}>{t.date}</Text>
            </View>
            <View style={styles.entryFeeBadge}>
              <Text style={styles.entryFeeText}>${t.entryFee} ENTRY</Text>
            </View>
            <TouchableOpacity
              style={styles.joinBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('TournamentDetails', { tournament: t })}
            >
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {/* ── Bottom Invite Banner ── */}
      <TouchableOpacity style={styles.bottomBanner} activeOpacity={0.85}>
        <Ionicons name="gift-outline" size={22} color={theme.primary} />
        <Text style={styles.bottomBannerText}>
          Invite friends & get up to{' '}
          <Text style={styles.bottomBannerHighlight}>$10</Text> bonus!
        </Text>
        <Ionicons name="chevron-forward" size={16} color={theme.subText} />
      </TouchableOpacity>

    </ScrollView>
  );
};

// ── Stack Navigator ────────────────────────────────────────────────

const UserTournaments = () => {
  const theme = useTheme() as AppTheme;
  const headerOpts = getHeaderOptions(theme);

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOpts,
        headerShown: true,
        headerTitle: 'Tournaments',
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <AppLogo iconOnly size="sm" />
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Ionicons name="options-outline" size={18} color={theme.text} style={{ marginRight: 6 }} />
            <Text style={{ color: theme.text, fontSize: 13, fontWeight: '500' }}>All Regions</Text>
            <Ionicons name="chevron-down" size={13} color={theme.subText} style={{ marginLeft: 3 }} />
          </View>
        ),
      }}
    >
      <Stack.Screen name="Tournaments" component={UserTournamentsContent} />
      <Stack.Screen
        name="TournamentDetails"
        component={TournamentDetails}
        options={({ navigation }) => ({
          headerTitle: 'Tournament Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ padding: 4, marginRight: 4 }}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={24} color={theme.text} />
              </TouchableOpacity>
              <AppLogo iconOnly size="sm" />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social-outline" size={20} color={theme.text} />
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600', marginLeft: 5 }}>Share</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default UserTournaments;
