import React, { useState, useCallback } from 'react';
import { useTheme } from '@emotion/react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/StyledComponents';
import { Game } from '../../types';
import { AppTheme } from '../../theme';
import { MatchesStackParamList } from '../../navigation/MatchesStack';

type GameSelectionScreenNavigationProp = StackNavigationProp<
  MatchesStackParamList,
  'GameSelection'
>;

const { width } = Dimensions.get('window');

// Mock data for available games
const mockGames: Game[] = [
  {
    id: '1',
    name: 'Chess',
    icon: require('../../assets/gaming.jpg'),
    description: 'Strategic board game for two players',
    maxPlayers: 2,
  },
  {
    id: '2',
    name: 'Checkers',
    icon: require('../../assets/gaming.jpg'),
    description: 'Classic strategy board game',
    maxPlayers: 2,
  },
  {
    id: '3',
    name: 'Call of Duty Mobile',
    icon: require('../../assets/gaming.jpg'),
    description: 'First-person shooter mobile game',
    maxPlayers: 10,
  },
  {
    id: '4',
    name: 'PUBG Mobile',
    icon: require('../../assets/gaming.jpg'),
    description: 'Battle royale mobile game',
    maxPlayers: 4,
  },
  {
    id: '5',
    name: 'FIFA Mobile',
    icon: require('../../assets/gaming.jpg'),
    description: 'Football simulation mobile game',
    maxPlayers: 2,
  },
];

const GameSelectionScreen: React.FC = () => {
  const navigation = useNavigation<GameSelectionScreenNavigationProp>();
  const theme = useTheme() as AppTheme;

  const handleGameSelect = useCallback((game: Game) => {
    navigation.navigate('OneOnOneMatch', { game });
  }, [navigation]);

  const renderGame = useCallback(({ item }: { item: Game }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        backgroundColor: theme.inputBackground,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={() => handleGameSelect(item)}
      activeOpacity={0.7}
    >
      <Image
        source={item.icon}
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          marginRight: 16,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontWeight: 'bold', 
          color: theme.primary,
          fontSize: 18,
          marginBottom: 4
        }}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={{ 
            color: theme.inputText, 
            fontSize: 14,
            marginBottom: 4
          }}>
            {item.description}
          </Text>
        )}
        <Text style={{ 
          color: theme.inputBorder, 
          fontSize: 12 
        }}>
          Max Players: {item.maxPlayers}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={theme.inputBorder}
      />
    </TouchableOpacity>
  ), [theme, handleGameSelect]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingHorizontal: 4
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: theme.primary,
            flex: 1
          }}>
            Select a Game
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SentRequests')}
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
              Requests
            </Text>
          </TouchableOpacity>
        </View>

        {/* Games List */}
        <FlatList
          data={mockGames}
          renderItem={renderGame}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </Container>
    </SafeAreaView>
  );
};

export default GameSelectionScreen;
