import React from 'react';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { AvatarImage } from '../../components/StyledComponents';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { clearUser } from '../../redux/userReducer';
import { clearStoredSession } from '../../utils/auth';
import { toast } from '../../utils/ToastService';
import { createStackNavigator } from '@react-navigation/stack';
import AppLogo from '../../components/AppLogo';
import StatCard from '../../components/profile/StatCard';
import AchievementCard from '../../components/profile/AchievementCard';
import RankProgressBar, { RankMilestone } from '../../components/profile/RankProgressBar';
import { AppTheme } from '../../theme';
import { RootState } from '../../redux/store';
import EditProfile from './EditProfile';
import PersonalInfo from './PersonalInfo';
import Location from './Location';
import Notifications from './Notifications';
import Account from './Account';
import Help from './Help';

const Stack = createStackNavigator();

const rankMilestones: RankMilestone[] = [
  { name: 'BRONZE', range: '0 - 999 RP', iconName: 'medal-outline', color: '#A0522D', completed: true },
  { name: 'SILVER', range: '1,000 - 1,999 RP', iconName: 'medal-outline', color: '#A8A9AD', completed: true },
  { name: 'GOLD', range: '2,000 - 2,999 RP', iconName: 'trophy-outline', color: '#D4AF37', active: true },
  { name: 'PLATINUM', range: '3,000+ RP', iconName: 'star-outline', color: '#5AC8FA', locked: true },
];

const achievements = [
  {
    title: 'FIRST WIN',
    subtitle: 'Win your first match',
    date: '01/01/2024',
    iconName: 'star' as const,
    iconColor: '#A8A9AD',
  },
  {
    title: 'TOURNAMENT CHAMPION',
    subtitle: 'Win a tournament',
    date: '05/15/2024',
    iconName: 'trophy' as const,
    iconColor: '#D4AF37',
  },
  {
    title: 'STREAK MASTER',
    subtitle: 'Win 5 matches in a row',
    date: '05/20/2024',
    iconName: 'flash' as const,
    iconColor: '#8B5CF6',
    badge: '5',
  },
];

// Settings menu — each item points to a screen registered in the stack below.
const menuOptions = [
  { label: 'Personal Info', iconName: 'person-circle-outline' as const, screen: 'PersonalInfo' },
  { label: 'Account', iconName: 'settings-outline' as const, screen: 'Account' },
  { label: 'Notifications', iconName: 'notifications-outline' as const, screen: 'Notifications' },
  { label: 'Location', iconName: 'location-outline' as const, screen: 'Location' },
  { label: 'Help & Support', iconName: 'help-circle-outline' as const, screen: 'Help' },
  { label: 'Edit Profile', iconName: 'create-outline' as const, screen: 'EditProfile' },
];

// Gameplay stats have no API yet, so these stay as presentational defaults.
const gameStats = {
  followers: '1.2K',
  following: '350',
  matches: '48',
  winRate: '67%',
  rank: 'GOLD',
  currentRp: 2450,
  maxRp: 3000,
  nextRank: 'PLATINUM',
  rpToNext: 550,
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerCard: {
      alignItems: 'center',
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 20,
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    avatarRing: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 3,
      borderColor: theme.rankGold,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 86,
      height: 86,
      borderRadius: 43,
      borderWidth: 0,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
    },
    handleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    handle: {
      fontSize: 13,
      color: theme.subText,
    },
    rankCard: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 16,
      padding: 16,
    },
    rankHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    rankTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.rankGold,
      marginLeft: 8,
    },
    rpText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    progressBarBg: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: theme.rankGold,
    },
    rpToNextText: {
      fontSize: 11,
      color: theme.subText,
      marginTop: 6,
    },
    statsRow: {
      flexDirection: 'row',
      marginHorizontal: 12,
      marginTop: 12,
    },
    bioCard: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 16,
      padding: 16,
    },
    bioText: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.subText,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.text,
      letterSpacing: 1,
    },
    viewAll: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600',
    },
    achievementsScroll: {
      paddingHorizontal: 16,
      paddingBottom: 4,
    },
    rankProgressContainer: {
      marginHorizontal: 16,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
    },
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: 12,
      marginTop: 20,
    },
    menuItem: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 12,
      margin: '1%',
      paddingVertical: 14,
      paddingHorizontal: 12,
    },
    menuIconBg: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.statCard,
      marginRight: 8,
    },
    menuLabel: {
      flex: 1,
      fontSize: 12,
      fontWeight: '500',
      color: theme.text,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      marginHorizontal: 16,
      marginTop: 24,
      marginBottom: 32,
      borderRadius: 14,
      paddingVertical: 16,
    },
    editButtonText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 1,
    },
    logoutButton: {
      backgroundColor: theme.error,
      marginTop: 0,
      shadowColor: theme.error,
    },
  });

const UserProfileContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearStoredSession();
          dispatch(clearUser());
          toast.info('You have been logged out');
        },
      },
    ]);
  };

  // Live values from redux with sensible fallbacks for first-run / demo state.
  const displayName = user.fullName || user.username || 'ProGamer';
  const handle = user.handle || (user.username ? `#${user.username.toUpperCase()}` : '#PROGAMER');
  const bio = user.bio;
  const rpProgress = gameStats.currentRp / gameStats.maxRp;

  const handleCopyHandle = () => {
    Alert.alert('Player tag copied', handle);
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatarRing}>
          <AvatarImage
            source={user.avatar ? { uri: user.avatar } : require('../../assets/avatar.jpg')}
            style={styles.avatar}
          />
        </View>
        <View style={styles.nameRow}>
          <Text style={styles.username}>{displayName}</Text>
          <Ionicons name="checkmark-circle" size={20} color={theme.primary} style={{ marginLeft: 6 }} />
        </View>
        <View style={styles.handleRow}>
          <Text style={styles.handle}>{handle}</Text>
          <TouchableOpacity onPress={handleCopyHandle} hitSlop={10}>
            <Ionicons name="copy-outline" size={14} color={theme.subText} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rank Card */}
      <View style={styles.rankCard}>
        <View style={styles.rankHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="trophy" size={26} color={theme.rankGold} />
            <Text style={styles.rankTitle}>{gameStats.rank} RANK</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="chevron-forward-outline" size={18} color={theme.subText} />
          </TouchableOpacity>
        </View>
        <Text style={styles.rpText}>
          {gameStats.currentRp.toLocaleString()} / {gameStats.maxRp.toLocaleString()} RP
        </Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.round(rpProgress * 100)}%` }]} />
        </View>
        <Text style={styles.rpToNextText}>
          {gameStats.rpToNext} RP to reach {gameStats.nextRank}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsRow}>
        <StatCard label="Followers" value={gameStats.followers} iconName="people-outline" />
        <StatCard label="Following" value={gameStats.following} iconName="person-add-outline" />
        <StatCard label="Matches" value={gameStats.matches} iconName="game-controller-outline" highlight />
        <StatCard label="Win Rate" value={gameStats.winRate} iconName="trophy-outline" iconColor={theme.rankGold} />
      </View>

      {/* Bio (only when set) */}
      {bio ? (
        <View style={styles.bioCard}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      ) : null}

      {/* Achievements */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>VIEW ALL {'>'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsScroll}
      >
        {achievements.map((a) => (
          <AchievementCard
            key={a.title}
            title={a.title}
            subtitle={a.subtitle}
            date={a.date}
            iconName={a.iconName}
            iconColor={a.iconColor}
            badge={a.badge}
          />
        ))}
      </ScrollView>

      {/* Rank Progression */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RANK PROGRESSION</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>VIEW STATS {'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rankProgressContainer}>
        <RankProgressBar milestones={rankMilestones} />
      </View>

      {/* Menu Options */}
      <View style={styles.menuGrid}>
        {menuOptions.map((opt) => (
          <TouchableOpacity
            key={opt.screen}
            style={styles.menuItem}
            onPress={() => navigation.navigate(opt.screen)}
          >
            <View style={styles.menuIconBg}>
              <Ionicons name={opt.iconName} size={18} color={theme.primary} />
            </View>
            <Text style={styles.menuLabel}>{opt.label}</Text>
            <Ionicons name="chevron-forward-outline" size={14} color={theme.subText} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.editButtonText}>EDIT PROFILE</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.editButton, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.editButtonText}>LOG OUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const UserProfile: React.FC = () => {
  const theme = useTheme() as AppTheme;

  // Back button used by the detail screens (overrides the AppLogo headerLeft).
  const backButton = (navigation: any) => () => (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }} hitSlop={10}>
      <Ionicons name="arrow-back" size={24} color={theme.text} />
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { color: theme.text },
        headerTintColor: theme.text,
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}><AppLogo size="sm" /></View>
        ),
        headerRight: () => (
          <Ionicons
            name="notifications-outline"
            size={26}
            color={theme.primary}
            style={{ marginRight: 16 }}
          />
        ),
      }}
    >
      <Stack.Screen name="ProfileMain" options={{ headerTitle: 'Profile' }}>
        {props => <UserProfileContent {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={({ navigation }) => ({ headerTitle: 'Edit Profile', headerRight: undefined, headerLeft: backButton(navigation) })}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={({ navigation }) => ({ headerTitle: 'Personal Info', headerRight: undefined, headerLeft: backButton(navigation) })}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={({ navigation }) => ({ headerTitle: 'Account', headerRight: undefined, headerLeft: backButton(navigation) })}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={({ navigation }) => ({ headerTitle: 'Notifications', headerRight: undefined, headerLeft: backButton(navigation) })}
      />
      <Stack.Screen
        name="Location"
        component={Location}
        options={({ navigation }) => ({ headerTitle: 'Location', headerRight: undefined, headerLeft: backButton(navigation) })}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={({ navigation }) => ({ headerTitle: 'Help & Support', headerRight: undefined, headerLeft: backButton(navigation) })}
      />
    </Stack.Navigator>
  );
};

export default UserProfile;
