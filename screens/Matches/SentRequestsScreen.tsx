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
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container } from '../../components/StyledComponents';
import { MatchRequest, Player, Game } from '../../types';
import { AppTheme } from '../../theme';

// Mock data for sent requests
const mockPlayers: Player[] = [
  {
    id: '1',
    username: 'ProGamer123',
    avatar: require('../../assets/avatar.jpg'),
    rating: 1250,
    isOnline: true,
  },
  {
    id: '2',
    username: 'GameMaster',
    avatar: require('../../assets/profile.jpg'),
    rating: 1180,
    isOnline: false,
  },
  {
    id: '3',
    username: 'SkillShot',
    avatar: require('../../assets/icon.png'),
    rating: 1420,
    isOnline: true,
  },
];

const mockGames: Game[] = [
  {
    id: '1',
    name: 'Chess',
    icon: require('../../assets/gaming.jpg'),
  },
  {
    id: '2',
    name: 'Call of Duty Mobile',
    icon: require('../../assets/gaming.jpg'),
  },
];

const mockRequests: MatchRequest[] = [
  {
    id: '1',
    senderId: 'current_user',
    recipientIds: ['1', '2'],
    gameId: '1',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
  },
  {
    id: '2',
    senderId: 'current_user',
    recipientIds: ['3'],
    gameId: '2',
    status: 'accepted',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago (expired)
  },
  {
    id: '3',
    senderId: 'current_user',
    recipientIds: ['1'],
    gameId: '1',
    status: 'declined',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000), // 21 hours from now
  },
];

const SentRequestsScreen: React.FC = () => {
  const theme = useTheme() as AppTheme;
  const [requests, setRequests] = useState<MatchRequest[]>(mockRequests);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCancelRequest = useCallback((requestId: string) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this match request?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setRequests(prev => prev.filter(req => req.id !== requestId));
          },
        },
      ]
    );
  }, []);

  const getStatusColor = (status: MatchRequest['status']) => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'accepted':
        return '#4CAF50';
      case 'declined':
        return '#F44336';
      case 'cancelled':
        return '#9E9E9E';
      default:
        return theme.inputBorder;
    }
  };

  const getStatusIcon = (status: MatchRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'accepted':
        return 'checkmark-circle';
      case 'declined':
        return 'close-circle';
      case 'cancelled':
        return 'ban';
      default:
        return 'help-circle';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const renderRequest = useCallback(({ item }: { item: MatchRequest }) => {
    const game = mockGames.find(g => g.id === item.gameId);
    const recipients = mockPlayers.filter(p => item.recipientIds.includes(p.id));
    
    return (
      <View
        style={{
          backgroundColor: theme.inputBackground,
          borderRadius: 12,
          padding: 16,
          marginVertical: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {/* Header with game and status */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 12
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Image
              source={game?.icon || require('../../assets/gaming.jpg')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                marginRight: 12,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontWeight: 'bold', 
                color: theme.primary,
                fontSize: 16,
              }}>
                {game?.name || 'Unknown Game'}
              </Text>
              <Text style={{ 
                color: theme.inputText, 
                fontSize: 12,
              }}>
                {formatTimeAgo(item.createdAt)}
              </Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={getStatusIcon(item.status)}
              size={20}
              color={getStatusColor(item.status)}
              style={{ marginRight: 4 }}
            />
            <Text style={{ 
              color: getStatusColor(item.status),
              fontSize: 12,
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Recipients */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ 
            color: theme.inputText, 
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8
          }}>
            Challenged Players:
          </Text>
          {recipients.map((player, index) => (
            <View key={player.id} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: index < recipients.length - 1 ? 6 : 0 
            }}>
              <Image
                source={player.avatar || require('../../assets/avatar.jpg')}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  marginRight: 8,
                }}
              />
              <Text style={{ 
                color: theme.primary, 
                fontSize: 14,
                fontWeight: '500'
              }}>
                {player.username}
              </Text>
              {player.isOnline && (
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#4CAF50',
                  marginLeft: 6,
                }} />
              )}
            </View>
          ))}
        </View>

        {/* Actions */}
        {item.status === 'pending' && (
          <TouchableOpacity
            style={{
              backgroundColor: '#F44336',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignSelf: 'flex-end',
            }}
            onPress={() => handleCancelRequest(item.id)}
            activeOpacity={0.7}
          >
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
              Cancel Request
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [theme, handleCancelRequest]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        {requests.length > 0 ? (
          <FlatList
            data={requests}
            renderItem={renderRequest}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.primary]}
                tintColor={theme.primary}
              />
            }
          />
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingVertical: 40
          }}>
            <Ionicons 
              name="send" 
              size={64} 
              color={theme.inputBorder} 
              style={{ marginBottom: 16 }}
            />
            <Text style={{ 
              fontSize: 18, 
              color: theme.inputText,
              textAlign: 'center',
              marginBottom: 8
            }}>
              No Sent Requests
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: theme.inputBorder,
              textAlign: 'center'
            }}>
              Challenge some players to see your requests here
            </Text>
          </View>
        )}
      </Container>
    </SafeAreaView>
  );
};

export default SentRequestsScreen;
