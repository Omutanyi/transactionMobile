import React from 'react';
import { useTheme } from '@emotion/react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme } from '../../theme';
import { createStyles } from './UserHome.styles';
import Carousel from '../../components/Carrousel';
import GlassBackground from '../../components/GlassBackground';
import GlassCard from '../../components/GlassCard';

const Stack = createStackNavigator();

const carouselData: { id: string; image: any; title: string; description: string }[] = [];

const liveActivity = [
  {
    id: 1,
    username: 'killerinstinct',
    action: 'won a match',
    game: 'FC24',
    timeAgo: '2 min ago',
    image: require('../../assets/gaming.jpg'),
  },
  {
    id: 2,
    username: 'ShadowAce',
    action: 'won a match',
    game: 'Valorant',
    timeAgo: '15 min ago',
    image: require('../../assets/profile.jpg'),
  },
  {
    id: 3,
    username: 'BoostMaster',
    action: 'won a match',
    game: 'Rocket League',
    timeAgo: '1 hr ago',
    image: require('../../assets/avatar.jpg'),
  },
];

const quickStats = {
  winStreak: 7,
  rank: 'DIAMOND III',
  rankPercent: 72,
  rankRp: 72,
  maxRp: 100,
  wins: 128,
  kdRatio: '2.45',
  trophies: 24,
};

const featuredTournament = {
  name: 'PRO LEAGUE CUP',
  subtitle: 'BATTLE THE BEST. BE THE CHAMPION.',
  prizePool: '$25,000',
};

const UserHomeContent = () => {
  const theme = useTheme() as AppTheme;
  const navigation = useNavigation() as any;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.top);

  return (
    <GlassBackground>
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* ── Welcome Header ── */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={require('../../assets/avatar.jpg')} style={styles.headerAvatar} />
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeSmall}>WELCOME BACK,</Text>
          <Text style={styles.welcomeName}>CHAMPION!</Text>
          <Text style={styles.welcomeSub}>Ready to dominate? 🎮</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Carousel (hidden when empty) ── */}
      {carouselData.length > 0 && (
        <Carousel data={carouselData} height={150} autoSlide slideInterval={4000} />
      )}

      {/* ── Quick Action Cards ── */}
      <View style={styles.actionRow}>
        {/* Tournaments */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardCyan]}
          onPress={() => navigation.navigate('CreateTournament')}
          activeOpacity={0.85}
        >
          <View style={styles.actionIconWrapper}>
            <Ionicons name="trophy-outline" size={36} color={theme.rankGold} />
          </View>
          <Text style={styles.actionTitle}>TOURNAMENTS</Text>
          <Text style={styles.actionSubtitle}>{'Compete & Win\nBig Prizes'}</Text>
          <View style={styles.actionArrowCyan}>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Play Match */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardPurple]}
          onPress={() => navigation.navigate('OneOnOneMatch')}
          activeOpacity={0.85}
        >
          <View style={styles.actionIconWrapper}>
            <Ionicons name="game-controller-outline" size={36} color={theme.rankBronze} />
          </View>
          <Text style={styles.actionTitle}>PLAY MATCH</Text>
          <Text style={styles.actionSubtitle}>{'Jump into\naction now!'}</Text>
          <View style={styles.actionArrowPurple}>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Quick Stats (full width) ── */}
      <GlassCard style={styles.sectionCard}>
        <Text style={styles.statsTitle}>QUICK STATS</Text>

        {/* Win Streak + Rank Progress side by side */}
        <View style={styles.statsInnerRow}>
          <View style={styles.statsHalfCol}>
            <Text style={styles.streakLabel}>WIN STREAK</Text>
            <View style={styles.streakRow}>
              <Text style={styles.streakNumber}>{quickStats.winStreak}</Text>
              <Ionicons name="flame" size={22} color={theme.warning} />
            </View>
            <Text style={styles.streakSub}>WINS</Text>
          </View>

          <View style={styles.statsHalfCol}>
            <Text style={styles.rankLabel}>RANK PROGRESS</Text>
            <View style={styles.rankNameRow}>
              <Ionicons name="medal-outline" size={14} color={theme.info} />
              <Text style={styles.rankNameText}>{quickStats.rank}</Text>
            </View>
            <View style={styles.rankBar}>
              <View style={[styles.rankBarFill, { width: `${quickStats.rankPercent}%` }]} />
            </View>
            <Text style={styles.rankRpText}>{quickStats.rankRp}/{quickStats.maxRp} RP</Text>
          </View>
        </View>

        {/* Mini Stats */}
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStat}>
            <Ionicons name="trophy-outline" size={14} color={theme.rankGold} />
            <Text style={styles.miniStatValue}>{quickStats.wins}</Text>
            <Text style={styles.miniStatLabel}>WINS</Text>
          </View>
          <View style={styles.miniStat}>
            <Ionicons name="swap-horizontal-outline" size={14} color={theme.info} />
            <Text style={styles.miniStatValue}>{quickStats.kdRatio}</Text>
            <Text style={styles.miniStatLabel}>K/D RATIO</Text>
          </View>
          <View style={styles.miniStat}>
            <Ionicons name="star-outline" size={14} color={theme.warning} />
            <Text style={styles.miniStatValue}>{quickStats.trophies}</Text>
            <Text style={styles.miniStatLabel}>TROPHIES</Text>
          </View>
        </View>
      </GlassCard>

      {/* ── Featured Tournament ── */}
      <View style={styles.featuredCard}>
        <Image
          source={require('../../assets/gaming.jpg')}
          style={styles.featuredBgImage}
          resizeMode="cover"
        />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredBody}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE NOW</Text>
          </View>
          <Text style={styles.featuredTitle}>{featuredTournament.name}</Text>
          <Text style={styles.featuredSubtitle}>{featuredTournament.subtitle}</Text>
          <Text style={styles.prizeLabel}>PRIZE POOL</Text>
          <Text style={styles.prizeAmount}>{featuredTournament.prizePool}</Text>
          <TouchableOpacity style={styles.joinBtn} activeOpacity={0.85}>
            <Text style={styles.joinBtnText}>JOIN NOW</Text>
            <Ionicons name="chevron-forward" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.featuredBadge}>
          <View style={styles.featuredBadgeBox}>
            <Ionicons name="trophy" size={28} color={theme.rankGold} />
            <Text style={styles.featuredBadgeText}>{'PRO\nLEAGUE'}</Text>
          </View>
        </View>
      </View>

      {/* ── Live Activity (full width, after featured card) ── */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.colHeaderRow}>
          <View style={styles.colTitleRow}>
            <Ionicons name="pulse-outline" size={13} color={theme.success} />
            <Text style={styles.colTitle}>LIVE ACTIVITY</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        {liveActivity.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.activityItem,
              index === liveActivity.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Image source={item.image} style={styles.activityThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityUsername}>{item.username}</Text>
              <Text style={styles.activityAction}>{item.action}</Text>
              <Text style={styles.activityGame}>{item.game}</Text>
            </View>
            <Text style={styles.activityTime}>{item.timeAgo}</Text>
          </View>
        ))}
      </GlassCard>
    </ScrollView>
    </GlassBackground>
  );
};

const UserHome = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProGamer" component={UserHomeContent} />
    </Stack.Navigator>
  );
};

export default UserHome;
