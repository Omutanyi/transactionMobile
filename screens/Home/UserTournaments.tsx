import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title} from '../../components/StyledComponents';
import { ScrollView, Image, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const gameOptions = ['All Games', 'FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'];

const dummyTournaments = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  tournamentName: `Tournament ${i + 1}`,
  gameName: ['FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'][i % 6],
  poolPrize: `$${(1000 + i * 50).toLocaleString()}`,
  startDate: `2025-10-${(i % 28) + 1}`,
  endDate: `2025-11-${(i % 28) + 1}`,
  status: ['ongoing', 'upcoming', 'history'][i % 3],
  image: [require('../../assets/gaming.jpg'), require('../../assets/ic_launcher.png'), require('../../assets/avatar.jpg'), require('../../assets/profile.jpg'), require('../../assets/icon.png')][i % 5],
  isMyTournament: true,
}));

const dummyFollowedTournaments = Array.from({ length: 20 }, (_, i) => ({
  id: i + 31,
  tournamentName: `Tournament ${i + 31}`,
  gameName: ['FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'][i % 6],
  playerName: `@${['ProGamer', 'EsportsKing', 'GameMaster', 'Champion', 'Legend'][i % 5]}${i + 1}`,
  poolPrize: `$${(2000 + i * 100).toLocaleString()}`,
  startDate: `2025-12-${(i % 28) + 1}`,
  endDate: `2025-12-${(i % 28) + 15}`,
  status: ['ongoing', 'upcoming', 'history'][i % 3],
  image: [require('../../assets/gaming.jpg'), require('../../assets/ic_launcher.png'), require('../../assets/avatar.jpg'), require('../../assets/profile.jpg'), require('../../assets/icon.png')][i % 5],
  isMyTournament: false,
}));

const TournamentCard = ({ tournament, theme }: any) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
    padding: 12,
    shadowRadius: 4,
    borderBottomWidth: 1, borderColor: '#eee'
  }}>
    <Image source={tournament.image} style={{ width: 70, height: 70, borderRadius: 12, marginRight: 16 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{tournament.tournamentName}</Text>
      {tournament.isMyTournament ? (
        <Text style={{ color: '#666', fontSize: 15 }}>{tournament.gameName}</Text>
      ) : (
        <Text style={{ color: '#666', fontSize: 15 }}>By {tournament.playerName} • {tournament.gameName}</Text>
      )}
      <Text style={{ color: theme.success, fontSize: 15 }}>Prize: {tournament.poolPrize}</Text>
      <Text style={{ color: theme.text, fontSize: 13 }}>Start: {tournament.startDate} | End: {tournament.endDate}</Text>
      {!tournament.isMyTournament && (
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

const OngoingTournamentsTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const filteredTournaments = dummyTournaments.filter(t => 
    t.status === 'ongoing' && (selectedGame === 'All Games' || t.gameName === selectedGame)
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTournaments.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} theme={theme} />
        ))}
      </ScrollView>
    </Container>
  );
};

const UpcomingTournamentsTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const filteredTournaments = dummyTournaments.filter(t => 
    t.status === 'upcoming' && (selectedGame === 'All Games' || t.gameName === selectedGame)
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTournaments.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} theme={theme} />
        ))}
      </ScrollView>
    </Container>
  );
};

const HistoryTournamentsTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const filteredTournaments = dummyTournaments.filter(t => 
    t.status === 'history' && (selectedGame === 'All Games' || t.gameName === selectedGame)
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTournaments.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} theme={theme} />
        ))}
      </ScrollView>
    </Container>
  );
};

const FollowingTournamentsTab = ({ selectedGame }: { selectedGame: string }) => {
  const theme = useTheme();
  const allFollowedTournaments = [...dummyFollowedTournaments];
  const filteredTournaments = allFollowedTournaments.filter(t => 
    selectedGame === 'All Games' || t.gameName === selectedGame
  );
  
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map(tournament => (
            <TournamentCard key={tournament.id} tournament={tournament} theme={theme} />
          ))
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Ionicons name="people-outline" size={48} color={'#666'} />
            <Text style={{ color: '#666', fontSize: 16, marginTop: 12, textAlign: 'center' }}>
              No tournaments from followed players
            </Text>
            <Text style={{ color: '#666', fontSize: 14, marginTop: 4, textAlign: 'center' }}>
              Follow players to see their tournaments here
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const Tab = createMaterialTopTabNavigator();

const UserTournamentsContent = ({ selectedGame }: { selectedGame: string }) => {
  return (
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
        {() => <OngoingTournamentsTab selectedGame={selectedGame} />}
      </Tab.Screen>
      <Tab.Screen name="Upcoming">
        {() => <UpcomingTournamentsTab selectedGame={selectedGame} />}
      </Tab.Screen>
      <Tab.Screen name="History">
        {() => <HistoryTournamentsTab selectedGame={selectedGame} />}
      </Tab.Screen>
      <Tab.Screen name="Following">
        {() => <FollowingTournamentsTab selectedGame={selectedGame} />}
      </Tab.Screen>
    </Tab.Navigator>
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

const TournamentScreenWrapper = () => {
  const [selectedGame, setSelectedGame] = useState('All Games');
  return <UserTournamentsContent selectedGame={selectedGame} />;
};

const UserTournaments = () => {
  const theme = useTheme();
  const [selectedGame, setSelectedGame] = useState('All Games');
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Tournaments',
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
      <Stack.Screen name="Tournaments">
        {() => <UserTournamentsContent selectedGame={selectedGame} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default UserTournaments;