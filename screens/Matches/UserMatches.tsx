import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Container } from '../../components/StyledComponents';
import { ScrollView, Image, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import MatchesStack from '../../navigation/MatchesStack';
import { AppTheme } from '../../theme';
import { createStyles, getTabScreenOptions } from './UserMatches.styles';
import GameDropdown from '../../components/input/GameDropdown';
import AppLogo from '../../components/AppLogo';

const dummyMatches = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  matchName: `Match ${i + 1}`,
  gameName: ['FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'][i % 6],
  opponent: `Player ${String.fromCharCode(65 + (i % 26))}`,
  prize: `$${(100 + i * 25).toLocaleString()}`,
  matchDate: `2025-12-${(i % 28) + 1}`,
  matchTime: `${10 + (i % 12)}:${i % 2 === 0 ? '00' : '30'} ${i % 2 === 0 ? 'AM' : 'PM'}`,
  status: ['ongoing', 'upcoming', 'completed'][i % 3],
  result: i % 3 === 2 ? (i % 2 === 0 ? 'won' : 'lost') : null,
  image: [
    require('../../assets/gaming.jpg'),
    require('../../assets/ic_launcher.png'),
    require('../../assets/avatar.jpg'),
    require('../../assets/profile.jpg'),
    require('../../assets/icon.png'),
  ][i % 5],
  isMyMatch: true,
}));

const dummyFollowedMatches = Array.from({ length: 25 }, (_, i) => ({
  id: i + 31,
  matchName: `Match ${i + 31}`,
  gameName: ['FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'][i % 6],
  playerName: `@${['ProGamer', 'EsportsKing', 'GameMaster', 'Champion', 'Legend'][i % 5]}${i + 1}`,
  opponent: `Player ${String.fromCharCode(65 + (i % 26))}`,
  prize: `$${(200 + i * 75).toLocaleString()}`,
  matchDate: `2025-12-${(i % 28) + 1}`,
  matchTime: `${10 + (i % 12)}:${i % 2 === 0 ? '00' : '30'} ${i % 2 === 0 ? 'AM' : 'PM'}`,
  status: ['ongoing', 'upcoming', 'completed'][i % 3],
  result: i % 3 === 2 ? (i % 2 === 0 ? 'won' : 'lost') : null,
  image: [
    require('../../assets/gaming.jpg'),
    require('../../assets/ic_launcher.png'),
    require('../../assets/avatar.jpg'),
    require('../../assets/profile.jpg'),
    require('../../assets/icon.png'),
  ][i % 5],
  isMyMatch: false,
}));

const MatchCard = ({ match, styles }: { match: any; styles: ReturnType<typeof createStyles> }) => (
  <View style={styles.cardRow}>
    <Image source={match.image} style={styles.cardImage} />
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>{match.matchName}</Text>
      {match.isMyMatch ? (
        <Text style={styles.cardSubtitle}>vs {match.opponent} • {match.gameName}</Text>
      ) : (
        <Text style={styles.cardSubtitle}>{match.playerName} vs {match.opponent} • {match.gameName}</Text>
      )}
      <Text style={styles.cardPrize}>Prize: {match.prize}</Text>
      <Text style={styles.cardDate}>{match.matchDate} at {match.matchTime}</Text>
      {match.result && (
        <Text style={match.result === 'won' ? styles.resultWon : styles.resultLost}>
          {match.result === 'won' ? 'WON' : 'LOST'}
        </Text>
      )}
      {!match.isMyMatch && (
        <View style={styles.followingBadge}>
          <Text style={styles.followingBadgeText}>FOLLOWING</Text>
        </View>
      )}
    </View>
  </View>
);

const OngoingTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const filtered = dummyMatches.filter(
    m => m.status === 'ongoing' && (selectedGame === 'All Games' || m.gameName === selectedGame),
  );
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(m => <MatchCard key={m.id} match={m} styles={styles} />)}
      </ScrollView>
    </Container>
  );
};

const UpcomingTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const filtered = dummyMatches.filter(
    m => m.status === 'upcoming' && (selectedGame === 'All Games' || m.gameName === selectedGame),
  );
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(m => <MatchCard key={m.id} match={m} styles={styles} />)}
      </ScrollView>
    </Container>
  );
};

const CompletedTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const filtered = dummyMatches.filter(
    m => m.status === 'completed' && (selectedGame === 'All Games' || m.gameName === selectedGame),
  );
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(m => <MatchCard key={m.id} match={m} styles={styles} />)}
      </ScrollView>
    </Container>
  );
};

const FollowingTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const filtered = dummyFollowedMatches.filter(
    m => selectedGame === 'All Games' || m.gameName === selectedGame,
  );
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map(m => <MatchCard key={m.id} match={m} styles={styles} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={theme.subText} />
            <Text style={styles.emptyText}>No matches from followed players</Text>
            <Text style={styles.emptySubtext}>Follow players to see their matches here</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const UserMatchesContent = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tab.Navigator screenOptions={getTabScreenOptions(theme)}>
        <Tab.Screen name="Ongoing">{() => <OngoingTab selectedGame={selectedGame} />}</Tab.Screen>
        <Tab.Screen name="Upcoming">{() => <UpcomingTab selectedGame={selectedGame} />}</Tab.Screen>
        <Tab.Screen name="Following">{() => <FollowingTab selectedGame={selectedGame} />}</Tab.Screen>
        <Tab.Screen name="Completed">{() => <CompletedTab selectedGame={selectedGame} />}</Tab.Screen>
      </Tab.Navigator>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => (navigation as any).navigate('NewMatch')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const UserMatches = () => {
  const theme = useTheme() as AppTheme;
  const [selectedGame, setSelectedGame] = useState('All Games');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Matches',
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { color: theme.text },
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <AppLogo size="sm" />
          </View>
        ),
        headerRight: () => (
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <GameDropdown selectedGame={selectedGame} onGameSelect={setSelectedGame} />
            <Ionicons
              name="notifications-outline"
              size={28}
              color={theme.primary}
              style={{ marginRight: 16 }}
            />
          </View>
        ),
      }}
    >
      <Stack.Screen name="Matches">
        {() => <UserMatchesContent selectedGame={selectedGame} />}
      </Stack.Screen>
      <Stack.Screen name="NewMatch" component={MatchesStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default UserMatches;
