import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles } from './OneOnOneMatchScreen.styles';
import AppLogo from '../../components/AppLogo';
import { fetchGames } from '../../services/games';

const Stack = createStackNavigator();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// ── Static data ────────────────────────────────────────────────────

const FALLBACK_GAMES = [
  { id: 'valorant', name: 'Valorant', image: require('../../assets/avatar.jpg') },
  { id: 'fifa', name: 'FIFA 24', image: require('../../assets/profile.jpg') },
  { id: 'cod', name: 'Call of Duty', image: require('../../assets/gaming.jpg') },
  { id: 'rocket', name: 'Rocket League', image: require('../../assets/icon.png') },
  { id: 'chess', name: 'Chess', image: require('../../assets/ic_launcher.png') },
  { id: 'pubg', name: 'PUBG Mobile', image: require('../../assets/gaming.jpg') },
];

const FALLBACK_IMAGES = FALLBACK_GAMES.map(g => g.image);

const MATCH_TYPES: { id: string; label: string; icon: IconName }[] = [
  { id: '1v1', label: '1v1 Duel', icon: 'person' },
  { id: '2v2', label: '2v2 Team', icon: 'people' },
  { id: 'ffa', label: 'Free For All', icon: 'people-circle' },
];

const SKILL_LEVELS: { id: string; label: string; color: (t: AppTheme) => string }[] = [
  { id: 'casual', label: 'Casual', color: t => t.success },
  { id: 'competitive', label: 'Competitive', color: t => t.info },
  { id: 'pro', label: 'Pro', color: t => t.secondary },
];

const STAKES: { id: string; label: string; sub: string; coins: number }[] = [
  { id: 'fun', label: 'For Fun', sub: '', coins: 1 },
  { id: 'low', label: 'Low Stakes', sub: '$5', coins: 2 },
  { id: 'medium', label: 'Medium', sub: '$20', coins: 3 },
  { id: 'high', label: 'High Stakes', sub: '$50', coins: 4 },
];

const OPPONENT_PREFS: { id: string; label: string; icon: IconName }[] = [
  { id: 'random', label: 'Random Match', icon: 'shuffle' },
  { id: 'friend', label: 'Challenge Friend', icon: 'person-add' },
  { id: 'invite', label: 'Invite Code', icon: 'keypad' },
];

const RECENT_OPPONENTS = [
  { id: 1, name: 'NightHawk', rank: 'Diamond II', time: '3 hours ago', won: true, avatar: require('../../assets/avatar.jpg') },
  { id: 2, name: 'Shadowz', rank: 'Platinum I', time: '5 hours ago', won: false, avatar: require('../../assets/profile.jpg') },
  { id: 3, name: 'GhostPlayz', rank: 'Diamond IV', time: '1 day ago', won: true, avatar: require('../../assets/gaming.jpg') },
];

const RECENT_FORM = [
  { h: 28, won: true },
  { h: 20, won: false },
  { h: 32, won: true },
  { h: 24, won: true },
  { h: 16, won: false },
  { h: 34, won: true },
  { h: 30, won: true },
];

const pad2 = (n: number) => String(n).padStart(2, '0');

// ── Content screen ─────────────────────────────────────────────────

const QuickMatchContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  const [selectedGame, setSelectedGame] = useState('cod');
  const [matchType, setMatchType] = useState('1v1');
  const [skill, setSkill] = useState('competitive');
  const [stake, setStake] = useState('medium');
  const [opponentPref, setOpponentPref] = useState('random');
  const [searching, setSearching] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [games, setGames] = useState(FALLBACK_GAMES);

  useEffect(() => {
    if (!searching) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [searching]);

  useEffect(() => {
    let active = true;
    fetchGames(FALLBACK_IMAGES)
      .then(list => {
        if (!active || !list.length) return;
        setGames(list);
        setSelectedGame(prev => (list.some(g => g.id === prev) ? prev : list[0].id));
      })
      .catch(() => { /* keep fallback games */ });
    return () => { active = false; };
  }, []);

  const toggleSearch = useCallback(() => {
    setSearching(s => {
      if (s) setElapsed(0);
      return !s;
    });
  }, []);

  const selectedIndex = games.findIndex(g => g.id === selectedGame);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Game selector ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gamesContent}
      >
        {games.map((g, i) => {
          const active = g.id === selectedGame;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.gameCard, active && styles.gameCardSelected]}
              onPress={() => setSelectedGame(g.id)}
              activeOpacity={0.9}
            >
              <Image source={g.image} style={styles.gameImage} resizeMode="cover" />
              <View style={styles.gameImageOverlay} />
              {active && (
                <>
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>SELECTED</Text>
                  </View>
                  <Text style={styles.gameRankNumber}>{i + 1}</Text>
                </>
              )}
              <View style={styles.gameNameBar}>
                <Text style={styles.gameName} numberOfLines={1}>{g.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {games.map((g, i) => (
          <View key={g.id} style={[styles.dot, i === selectedIndex && styles.dotActive]} />
        ))}
      </View>

      {/* ── Match Type ── */}
      <View style={styles.sectionRow}>
        <Ionicons name="git-compare-outline" size={15} color={theme.info} />
        <Text style={styles.sectionTitle}>MATCH TYPE</Text>
      </View>
      <View style={styles.selectorRow}>
        {MATCH_TYPES.map(mt => {
          const active = matchType === mt.id;
          return (
            <TouchableOpacity
              key={mt.id}
              style={[styles.optionCard, active && styles.optionCardActive]}
              onPress={() => setMatchType(mt.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.optionIconCircle, active && styles.optionIconCircleActive]}>
                <Ionicons name={mt.icon} size={20} color={active ? theme.info : theme.subText} />
              </View>
              <Text style={[styles.optionLabel, !active && styles.optionLabelMuted]}>{mt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Skill Level ── */}
      <View style={styles.sectionRow}>
        <Ionicons name="ribbon-outline" size={15} color={theme.info} />
        <Text style={styles.sectionTitle}>SKILL LEVEL</Text>
      </View>
      <View style={styles.selectorRow}>
        <View style={styles.skillConnector} />
        {SKILL_LEVELS.map(sl => {
          const active = skill === sl.id;
          const color = sl.color(theme);
          return (
            <TouchableOpacity
              key={sl.id}
              style={[
                styles.optionCard,
                active && { borderColor: color, backgroundColor: color + '14', shadowColor: color, shadowOpacity: 0.4, shadowRadius: 9, elevation: 5 },
              ]}
              onPress={() => setSkill(sl.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.optionIconCircle, active && { backgroundColor: color + '26' }]}>
                <Ionicons name="shield-half" size={20} color={active ? color : theme.subText} />
              </View>
              <Text style={[styles.optionLabel, !active && styles.optionLabelMuted, active && { color }]}>
                {sl.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Stake / Wager ── */}
      <View style={styles.sectionRow}>
        <Ionicons name="cash-outline" size={15} color={theme.info} />
        <Text style={styles.sectionTitle}>STAKE / WAGER</Text>
      </View>
      <View style={styles.selectorRow}>
        {STAKES.map(st => {
          const active = stake === st.id;
          return (
            <TouchableOpacity
              key={st.id}
              style={[styles.optionCard, active && styles.optionCardActive]}
              onPress={() => setStake(st.id)}
              activeOpacity={0.85}
            >
              <View style={styles.coinsRow}>
                {Array.from({ length: st.coins }).map((_, i) => (
                  <View key={i} style={styles.coin} />
                ))}
              </View>
              <Text style={[styles.optionLabel, !active && styles.optionLabelMuted]} numberOfLines={1}>
                {st.label}
              </Text>
              {!!st.sub && (
                <Text style={[styles.optionSub, active && styles.optionSubActive]}>{st.sub}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Opponent Preference ── */}
      <View style={styles.sectionRow}>
        <Ionicons name="people-outline" size={15} color={theme.info} />
        <Text style={styles.sectionTitle}>OPPONENT PREFERENCE</Text>
      </View>
      <View style={styles.selectorRow}>
        {OPPONENT_PREFS.map(op => {
          const active = opponentPref === op.id;
          return (
            <TouchableOpacity
              key={op.id}
              style={[styles.optionCard, active && styles.optionCardActive]}
              onPress={() => setOpponentPref(op.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.optionIconCircle, active && styles.optionIconCircleActive]}>
                <Ionicons name={op.icon} size={20} color={active ? theme.info : theme.subText} />
              </View>
              <Text style={[styles.optionLabel, !active && styles.optionLabelMuted]} numberOfLines={1}>
                {op.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Quick Stats ── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="stats-chart" size={15} color={theme.info} />
          <Text style={styles.cardHeaderTitle}>QUICK STATS</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>YOUR RANK</Text>
            <View style={styles.rankEmblem}>
              <Ionicons name="diamond" size={18} color={theme.info} />
            </View>
            <Text style={styles.rankName}>Diamond III</Text>
            <Text style={styles.rankSub}>3,245 RP</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>WIN RATE</Text>
            <View style={styles.ring}>
              <Text style={styles.ringText}>68%</Text>
            </View>
            <Text style={styles.rankSub}>124 wins</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>RECENT FORM</Text>
            <View style={styles.barsRow}>
              {RECENT_FORM.map((b, i) => (
                <View
                  key={i}
                  style={[styles.bar, { height: b.h, backgroundColor: b.won ? theme.success : theme.notification }]}
                />
              ))}
            </View>
            <Text style={styles.formText}>7W - 2L</Text>
          </View>
        </View>
      </View>

      {/* ── Matchmaking ── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="radio" size={15} color={theme.info} />
          <Text style={styles.cardHeaderTitle}>MATCHMAKING</Text>
        </View>
        <View style={styles.radarWrapper}>
          <View style={styles.radarOuter} />
          <View style={styles.radarMid} />
          <View style={styles.radarInner}>
            <Ionicons name={searching ? 'scan' : 'game-controller'} size={22} color={theme.info} />
          </View>
        </View>
        <Text style={styles.matchStatusText}>
          {searching ? 'SEARCHING FOR OPPONENT' : 'READY TO MATCH'}
        </Text>
        {searching ? (
          <Text style={styles.matchSubText}>
            Estimated time: <Text style={styles.matchSubAccent}>{pad2(Math.floor(elapsed / 60))}:{pad2(elapsed % 60)}</Text>
            {'   •   '}Connecting...
          </Text>
        ) : (
          <Text style={styles.matchSubText}>Tap Find Match to enter the queue</Text>
        )}
      </View>

      {/* ── Find Match button ── */}
      <TouchableOpacity
        style={[styles.findBtn, searching && styles.findBtnCancel]}
        onPress={toggleSearch}
        activeOpacity={0.9}
      >
        <Ionicons name={searching ? 'close-circle' : 'flash'} size={22} color="#fff" />
        <Text style={styles.findBtnText}>{searching ? 'CANCEL SEARCH' : 'FIND MATCH'}</Text>
      </TouchableOpacity>

      {/* ── Recent Opponents ── */}
      <View style={styles.sectionRow}>
        <Ionicons name="time-outline" size={15} color={theme.info} />
        <Text style={styles.sectionTitle}>RECENT OPPONENTS</Text>
        <View style={styles.sectionSpacer} />
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={[styles.opponentRank, { fontSize: 11 }]}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>
      {RECENT_OPPONENTS.map(op => (
        <View key={op.id} style={styles.opponentRow}>
          <Image source={op.avatar} style={styles.opponentAvatar} />
          <View style={styles.opponentInfo}>
            <Text style={styles.opponentName}>{op.name}</Text>
            <View style={styles.opponentMetaRow}>
              <Text style={styles.opponentRank}>{op.rank}</Text>
              <Text style={styles.opponentTime}>{op.time}</Text>
            </View>
          </View>
          <View
            style={[
              styles.resultBadge,
              { backgroundColor: (op.won ? theme.success : theme.notification) + '1F' },
            ]}
          >
            <Text style={[styles.resultBadgeText, { color: op.won ? theme.success : theme.notification }]}>
              {op.won ? 'WIN' : 'LOSS'}
            </Text>
          </View>
          <TouchableOpacity style={styles.rematchBtn} activeOpacity={0.85}>
            <Text style={styles.rematchBtnText}>REMATCH</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* ── Bottom stats bar ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomStat}>
          <Ionicons name="people" size={15} color={theme.success} />
          <Text style={styles.bottomStatValue}>1,247</Text>
          <Text style={styles.bottomStatLabel}>ONLINE</Text>
        </View>
        <View style={styles.bottomDivider} />
        <View style={styles.bottomStat}>
          <Ionicons name="flash" size={15} color={theme.warning} />
          <Text style={styles.bottomStatValue}>3</Text>
          <Text style={styles.bottomStatLabel}>ACTIVE</Text>
        </View>
        <View style={styles.bottomDivider} />
        <View style={styles.bottomStat}>
          <Ionicons name="shield-checkmark" size={15} color={theme.info} />
          <Text style={styles.bottomStatValue}>Secure</Text>
          <Text style={styles.bottomStatLabel}>FAIR PLAY</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// ── Header ─────────────────────────────────────────────────────────

const QuickMatchHeaderLeft = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const handleBack = () => {
    const parent = navigation.getParent();
    if (parent && parent.canGoBack()) parent.goBack();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.headerLeftRow}>
      <TouchableOpacity style={styles.headerBackBtn} onPress={handleBack} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <AppLogo iconOnly size="sm" />
    </View>
  );
};

const QuickMatchHeaderRight = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  return (
    <View style={styles.headerRightRow}>
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="notifications-outline" size={22} color={theme.text} />
      </TouchableOpacity>
      <Image source={require('../../assets/avatar.jpg')} style={styles.headerAvatar} />
    </View>
  );
};

// ── Stack Navigator ────────────────────────────────────────────────

const OneOnOneMatchScreen = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Text style={styles.headerTitleText}>
            QUICK <Text style={styles.headerTitleAccent}>MATCH</Text>
          </Text>
        ),
        headerLeft: () => <QuickMatchHeaderLeft />,
        headerRight: () => <QuickMatchHeaderRight />,
      }}
    >
      <Stack.Screen name="QuickMatch" component={QuickMatchContent} />
    </Stack.Navigator>
  );
};

export default OneOnOneMatchScreen;
