import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title} from '../../components/StyledComponents';
import { ScrollView, Image, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import MatchesStack from '../../navigation/MatchesStack';

const gameOptions = ['All Games', 'FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'];

const dummyMatches = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  matchName: `Match ${i + 1}`,
  gameName: ['FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'][i % 6],
  opponent: `Player ${String.fromCharCode(65 + (i % 26))}`,
  prize: `$${(100 + i * 25).toLocaleString()}`,
  matchDate: `2025-12-${(i % 28) + 1}`,
  matchTime: `${(10 + (i % 12))}:${(i % 2 === 0 ? '00' : '30')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
  status: ['ongoing', 'upcoming', 'completed'][i % 3],
  result: i % 3 === 2 ? (i % 2 === 0 ? 'won' : 'lost') : null,
  image: [require('../../assets/gaming.jpg'), require('../../assets/ic_launcher.png'), require('../../assets/avatar.jpg'), require('../../assets/profile.jpg'), require('../../assets/icon.png')][i % 5],
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
  matchTime: `${(10 + (i % 12))}:${(i % 2 === 0 ? '00' : '30')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
  status: ['ongoing', 'upcoming', 'completed'][i % 3],
  result: i % 3 === 2 ? (i % 2 === 0 ? 'won' : 'lost') : null,
  image: [require('../../assets/gaming.jpg'), require('../../assets/ic_launcher.png'), require('../../assets/avatar.jpg'), require('../../assets/profile.jpg'), require('../../assets/icon.png')][i % 5],
  isMyMatch: false,
}));

const MatchCard = ({ match, theme }: any) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
    padding: 12,
    shadowRadius: 4,
    borderBottomWidth: 1, 
    borderColor: '#eee'
  }}>
    <Image source={match.image} style={{ width: 70, height: 70, borderRadius: 12, marginRight: 16 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{match.matchName}</Text>
      {match.isMyMatch ? (
        <Text style={{ color: theme.secondary, fontSize: 15 }}>vs {match.opponent} • {match.gameName}</Text>
      ) : (
        <Text style={{ color: theme.secondary, fontSize: 15 }}>{match.playerName} vs {match.opponent} • {match.gameName}</Text>
      )}
      <Text style={{ color: theme.success, fontSize: 15 }}>Prize: {match.prize}</Text>
      <Text style={{ color: theme.text, fontSize: 13 }}>{match.matchDate} at {match.matchTime}</Text>
      {match.result && (
        <Text style={{ 
          color: match.result === 'won' ? theme.success : '#FF3B30', 
          fontSize: 13, 
          fontWeight: '600',
          marginTop: 2
        }}>
          {match.result === 'won' ? 'WON' : 'LOST'}
        </Text>
      )}
      {!match.isMyMatch && (
        <View style={{ 
          backgroundColor: '#007AFF10', 
          paddingHorizontal: 8, 
          paddingVertical: 2, 
          borderRadius: 12, 
          alignSelf: 'flex-start',
          marginTop: 4
        }}>
          <Text style={{ color: '#007AFF', fontSize: 11, fontWeight: '600' }}>FOLLOWING</Text>
        </View>
      )}
    </View>
  </View>
);

const OngoingMatchesTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const filteredMatches = dummyMatches.filter(m => 
    m.status === 'ongoing' && (selectedGame === 'All Games' || m.gameName === selectedGame)
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredMatches.map(match => (
          <MatchCard key={match.id} match={match} theme={theme} />
        ))}
      </ScrollView>
    </Container>
  );
};

const UpcomingMatchesTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const filteredMatches = dummyMatches.filter(m => 
    m.status === 'upcoming' && (selectedGame === 'All Games' || m.gameName === selectedGame)
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredMatches.map(match => (
          <MatchCard key={match.id} match={match} theme={theme} />
        ))}
      </ScrollView>
    </Container>
  );
};

const CompletedMatchesTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const filteredMatches = dummyMatches.filter(m => 
    m.status === 'completed' && (selectedGame === 'All Games' || m.gameName === selectedGame)
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredMatches.map(match => (
          <MatchCard key={match.id} match={match} theme={theme} />
        ))}
      </ScrollView>
    </Container>
  );
};

const FollowingMatchesTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const allFollowedMatches = [...dummyFollowedMatches];
  const filteredMatches = allFollowedMatches.filter(m => 
    selectedGame === 'All Games' || m.gameName === selectedGame
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} theme={theme} />
          ))
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Ionicons name="people-outline" size={48} color={'#666'} />
            <Text style={{ color: '#666', fontSize: 16, marginTop: 12, textAlign: 'center' }}>
              No matches from followed players
            </Text>
            <Text style={{ color: '#666', fontSize: 14, marginTop: 4, textAlign: 'center' }}>
              Follow players to see their matches here
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const Tab = createMaterialTopTabNavigator();

const UserMatchesContent = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const handleNewMatch = () => {
    // Navigate to the new matches stack
    (navigation as any).navigate('NewMatch');
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 60 },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarScrollEnabled: true,
        }}
      >
        <Tab.Screen name="Ongoing">
          {() => <OngoingMatchesTab selectedGame={selectedGame} />}
        </Tab.Screen>
        <Tab.Screen name="Upcoming">
          {() => <UpcomingMatchesTab selectedGame={selectedGame} />}
        </Tab.Screen>
        <Tab.Screen name="Following">
          {() => <FollowingMatchesTab selectedGame={selectedGame} />}
        </Tab.Screen>
        <Tab.Screen name="Completed">
          {() => <CompletedMatchesTab selectedGame={selectedGame} />}
        </Tab.Screen>
      </Tab.Navigator>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#007AFF',
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={handleNewMatch}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const GameDropdown = ({ selectedGame, onGameSelect, theme }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity
        onPress={() => setShowDropdown(!showDropdown)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: theme.inputBackground,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      >
        <Text style={{ color: theme.text, fontSize: 14, marginRight: 4 }}>
          {selectedGame}
        </Text>
        <Ionicons 
          name={showDropdown ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={theme.text} 
        />
      </TouchableOpacity>
      
      {showDropdown && (
        <View style={{
          position: 'absolute',
          top: 40,
          right: 0,
          backgroundColor: theme.inputBackground,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 1000,
          minWidth: 120,
        }}>
          {gameOptions.map((game, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onGameSelect(game);
                setShowDropdown(false);
              }}
              style={{
                padding: 12,
                borderBottomWidth: index < gameOptions.length - 1 ? 1 : 0,
                borderBottomColor: '#eee',
              }}
            >
              <Text style={{ 
                color: selectedGame === game ? '#007AFF' : theme.text,
                fontSize: 14,
                fontWeight: selectedGame === game ? '600' : '400'
              }}>
                {game}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const Stack = createStackNavigator();

const logo = require('../../assets/ic_launcher.png');

const MatchScreenWrapper = () => {
  const [selectedGame, setSelectedGame] = useState('All Games');
  return <UserMatchesContent selectedGame={selectedGame} />;
};

const UserMatches = () => {
  const theme = useTheme();
  const [selectedGame, setSelectedGame] = useState('All Games');
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Matches',
        headerLeft: () => (
          <Image
            source={logo}
            style={{ width: 32, height: 32, marginLeft: 16 }}
          />
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <GameDropdown 
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              theme={theme}
            />
            <Ionicons
              name="notifications-outline"
              size={28}
              color={'#007AFF'}
              style={{ marginRight: 16 }}
            />
          </View>
        ),
      }}
    >
      <Stack.Screen name="Matches">
        {() => <UserMatchesContent selectedGame={selectedGame} />}
      </Stack.Screen>
      <Stack.Screen 
        name="NewMatch" 
        component={MatchesStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default UserMatches;