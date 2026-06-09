import React, { useState, useCallback } from 'react';
import { useTheme } from '@emotion/react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert, 
  SafeAreaView,
  Dimensions,
  ImageSourcePropType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import InputWithIcon from '../../components/input/InputWithIcon';
import { Container } from '../../components/StyledComponents';
import { Player, Game } from '../../types';
import { AppTheme } from '../../theme';
import { MatchesStackParamList } from '../../navigation/MatchesStack';

type OneOnOneMatchScreenNavigationProp = StackNavigationProp<
  MatchesStackParamList,
  'OneOnOneMatch'
>;

type OneOnOneMatchScreenRouteProp = RouteProp<
  MatchesStackParamList,
  'OneOnOneMatch'
>;

interface Props {
  navigation?: OneOnOneMatchScreenNavigationProp;
  route?: OneOnOneMatchScreenRouteProp;
}

const { width } = Dimensions.get('window');

// Mock data for players - this could be filtered based on game preference in a real app
const mockPlayers: Player[] = [
  {
    id: '1',
    username: 'ChessMaster2024',
    avatar: require('../../assets/avatar.jpg'),
    rating: 1850,
    gamesPlayed: 245,
    winRate: 78,
    isOnline: true,
  },
  {
    id: '2',
    username: 'TacticalGenius',
    avatar: require('../../assets/profile.jpg'),
    rating: 1680,
    gamesPlayed: 132,
    winRate: 65,
    isOnline: true,
  },
  {
    id: '3',
    username: 'QuickStrike',
    avatar: require('../../assets/icon.png'),
    rating: 2020,
    gamesPlayed: 367,
    winRate: 82,
    isOnline: false,
  },
  {
    id: '4',
    username: 'ProGamer_X',
    avatar: require('../../assets/ic_launcher.png'),
    rating: 1750,
    gamesPlayed: 189,
    winRate: 74,
    isOnline: true,
  },
  {
    id: '5',
    username: 'EliteWarrior',
    avatar: require('../../assets/avatar.jpg'),
    rating: 1950,
    gamesPlayed: 420,
    winRate: 88,
    isOnline: true,
  },
  {
    id: '6',
    username: 'StrategyKing',
    avatar: require('../../assets/profile.jpg'),
    rating: 1590,
    gamesPlayed: 98,
    winRate: 71,
    isOnline: false,
  },
  {
    id: '7',
    username: 'GameLegend',
    avatar: require('../../assets/ic_launcher.png'),
    rating: 2100,
    gamesPlayed: 567,
    winRate: 91,
    isOnline: true,
  },
  {
    id: '8',
    username: 'RapidFire',
    avatar: require('../../assets/avatar.jpg'),
    rating: 1420,
    gamesPlayed: 76,
    winRate: 68,
    isOnline: true,
  },
];

const OneOnOneMatchScreen: React.FC<Props> = () => {
  const navigation = useNavigation<OneOnOneMatchScreenNavigationProp>();
  const route = useRoute<OneOnOneMatchScreenRouteProp>();
  const theme = useTheme() as AppTheme;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const game = route.params?.game;

  // Mock games data for quick selection
  const quickGames: Game[] = [
    {
      id: '1',
      name: 'Chess',
      icon: require('../../assets/gaming.jpg'),
      description: 'Strategic board game for two players',
      maxPlayers: 2,
    },
    {
      id: '2',
      name: 'Call of Duty Mobile',
      icon: require('../../assets/gaming.jpg'),
      description: 'First-person shooter mobile game',
      maxPlayers: 10,
    },
    {
      id: '3',
      name: 'FIFA Mobile',
      icon: require('../../assets/gaming.jpg'),
      description: 'Football simulation mobile game',
      maxPlayers: 2,
    },
  ];

  const handleQuickGameSelect = useCallback((selectedGame: Game) => {
    navigation.navigate('OneOnOneMatch', { game: selectedGame });
  }, [navigation]);

  // Handle case where game is not provided
  if (!game) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Container>
          {/* Header with back button */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 24,
            paddingHorizontal: 4
          }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.primary} />
            </TouchableOpacity>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.primary
            }}>
              Select a Game
            </Text>
          </View>

          {/* Quick Game Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.primary,
              marginBottom: 16
            }}>
              Popular Games
            </Text>
            
            {quickGames.map((gameItem) => (
              <TouchableOpacity
                key={gameItem.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  marginBottom: 12,
                  backgroundColor: theme.inputBackground,
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 3,
                }}
                onPress={() => handleQuickGameSelect(gameItem)}
                activeOpacity={0.7}
              >
                <Image
                  source={gameItem.icon}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    marginRight: 16,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontWeight: 'bold', 
                    color: theme.primary,
                    fontSize: 16,
                    marginBottom: 2
                  }}>
                    {gameItem.name}
                  </Text>
                  <Text style={{ 
                    color: theme.inputText, 
                    fontSize: 12,
                    marginBottom: 2
                  }}>
                    {gameItem.description}
                  </Text>
                  <Text style={{ 
                    color: theme.inputBorder, 
                    fontSize: 11 
                  }}>
                    Max Players: {gameItem.maxPlayers}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.inputBorder}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={{ marginTop: 'auto' }}>
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 12,
              }}
              onPress={() => navigation.navigate('GameSelection')}
            >
              <Ionicons name="apps" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
                View All Games
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: theme.inputBorder,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{
                color: theme.inputText,
                fontSize: 16,
                fontWeight: '600',
              }}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </Container>
      </SafeAreaView>
    );
  }

  const filteredPlayers = mockPlayers.filter(player =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayerSelect = useCallback((player: Player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        // For one-on-one matches, limit to game's max players or 1
        const maxPlayers = game?.maxPlayers || 1;
        if (prev.length >= maxPlayers) {
          Alert.alert(
            'Selection Limit',
            `You can select up to ${maxPlayers} players for ${game?.name || 'this game'}.`,
            [{ text: 'OK' }]
          );
          return prev;
        }
        return [...prev, player];
      }
    });
  }, [game]);

  const handleChallengePlayers = useCallback(() => {
    if (selectedPlayers.length === 0) {
      Alert.alert('No Players Selected', 'Please select at least one player to challenge.');
      return;
    }

    const playerNames = selectedPlayers.map(p => p.username).join(', ');
    const gameName = game?.name || 'this game';
    const message = selectedPlayers.length === 1 
      ? `Do you want to challenge ${playerNames} to a ${gameName} match?`
      : `Do you want to challenge ${playerNames} to a ${gameName} match?`;

    Alert.alert(
      'Challenge Players',
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Challenge',
          onPress: () => {
            const successMessage = selectedPlayers.length === 1
              ? `Your challenge has been sent to ${playerNames}. They will be notified about your request.`
              : `Your challenges have been sent to ${playerNames}. They will be notified about your request.`;
            
            Alert.alert(
              'Challenge Sent!',
              successMessage,
              [
                {
                  text: 'View Requests',
                  onPress: () => navigation.navigate('SentRequests'),
                },
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  }, [selectedPlayers, navigation, game]);

  const renderPlayer = useCallback(({ item }: { item: Player }) => {
    const isSelected = selectedPlayers.some(p => p.id === item.id);
    
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          marginVertical: 4,
          backgroundColor: isSelected ? theme.primary + '20' : theme.inputBackground,
          borderRadius: 12,
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? theme.primary : 'transparent',
        }}
        onPress={() => handlePlayerSelect(item)}
        activeOpacity={0.7}
      >
        <Image
          source={item.avatar}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 12,
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ 
              fontWeight: 'bold', 
              color: theme.primary,
              fontSize: 16,
              marginRight: 8
            }}>
              {item.username}
            </Text>
            {item.isOnline && (
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#4CAF50',
              }} />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Text style={{ 
              color: theme.inputText, 
              fontSize: 12,
              marginRight: 16
            }}>
              Rating: {item.rating}
            </Text>
            <Text style={{ 
              color: theme.inputText, 
              fontSize: 12 
            }}>
              Win Rate: {item.winRate}%
            </Text>
          </View>
          <Text style={{ 
            color: theme.inputBorder, 
            fontSize: 11 
          }}>
            Games Played: {item.gamesPlayed}
          </Text>
        </View>
        <Ionicons
          name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color={isSelected ? theme.primary : theme.inputBorder}
        />
      </TouchableOpacity>
    );
  }, [selectedPlayers, theme, handlePlayerSelect]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 20,
          paddingHorizontal: 4
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {game?.icon && (
              <Image
                source={game.icon}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  marginRight: 12,
                }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: 'bold', 
                color: theme.primary
              }}>
                {game?.name || 'Select Game'}
              </Text>
              <Text style={{ 
                fontSize: 12, 
                color: theme.inputText
              }}>
                Find players to challenge
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SentRequests')}
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
              Requests
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={{ marginBottom: 20 }}>
          <InputWithIcon
            icon={<Ionicons name="search" size={20} color={theme.inputBorder} />}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search players..."
          />
        </View>

        {/* Players List */}
        <View style={{ flex: 1, marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            marginBottom: 12,
            color: theme.primary
          }}>
            Available Players
          </Text>
          
          {filteredPlayers.length > 0 ? (
            <FlatList
              data={filteredPlayers}
              renderItem={renderPlayer}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingVertical: 40
            }}>
              <Ionicons 
                name="search" 
                size={64} 
                color={theme.inputBorder} 
                style={{ marginBottom: 16 }}
              />
              <Text style={{ 
                fontSize: 16, 
                color: theme.inputText,
                textAlign: 'center'
              }}>
                No players found matching your search
              </Text>
            </View>
          )}
        </View>

        {/* Selected Players Summary */}
        {selectedPlayers.length > 0 && (
          <View style={{
            backgroundColor: theme.primary + '10',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}>
            <Text style={{
              color: theme.primary,
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 8,
            }}>
              Selected Players ({selectedPlayers.length}/{game?.maxPlayers || 1}):
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {selectedPlayers.map((player, index) => (
                <View key={player.id} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 4,
                }}>
                  <Image
                    source={player.avatar}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      marginRight: 6,
                    }}
                  />
                  <Text style={{
                    color: theme.primary,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                    {player.username}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Challenge Button */}
        <TouchableOpacity
          style={{
            backgroundColor: selectedPlayers.length > 0 ? theme.primary : theme.inputBorder,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 'auto',
          }}
          onPress={handleChallengePlayers}
          disabled={selectedPlayers.length === 0}
          activeOpacity={0.8}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
            {selectedPlayers.length > 0 
              ? `Challenge ${selectedPlayers.length} Player${selectedPlayers.length > 1 ? 's' : ''}`
              : 'Select Players to Challenge'
            }
          </Text>
        </TouchableOpacity>
      </Container>
    </SafeAreaView>
  );
};

export default OneOnOneMatchScreen;
