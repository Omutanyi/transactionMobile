import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Container } from '../../components/StyledComponents';
import { AppTheme } from '../../theme';
import { request } from '../../requests';
import apis from '../../api';

const FALLBACK_GAME_IMAGE = require('../../assets/gaming.jpg');
const FALLBACK_AVATAR = require('../../assets/avatar.jpg');

const SentRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await request(apis.matchRequestsSent, { method: 'GET' });
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setRequests(list);
    } catch (e) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  }, [fetchRequests]);

  const handleCancelRequest = useCallback((requestId: number) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this match request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await request(apis.matchRequestDetail(requestId), { method: 'DELETE' });
              setRequests(prev => prev.filter(req => (req.Id ?? req.id) !== requestId));
            } catch (e: any) {
              Alert.alert('Error', e?.message || 'Failed to cancel request');
            }
          },
        },
      ]
    );
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FF9500';
      case 'accepted': return '#4CAF50';
      case 'declined': return '#F44336';
      case 'cancelled': return '#9E9E9E';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string): React.ComponentProps<typeof Ionicons>['name'] => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'time-outline';
      case 'accepted': return 'checkmark-circle';
      case 'declined': return 'close-circle';
      case 'cancelled': return 'ban';
      default: return 'help-circle';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
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

  const renderRequest = useCallback(({ item }: { item: any }) => {
    const gameName = item.GameName ?? item.gameName ?? 'Unknown Game';
    const recipientName = item.RecipientName ?? item.recipientName ?? '';
    const status = item.Status ?? item.status ?? 'pending';
    const createdAt = item.CreatedAt ?? item.createdAt ?? new Date().toISOString();
    const requestId = item.Id ?? item.id;

    return (
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Image source={FALLBACK_GAME_IMAGE} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', color: '#007AFF', fontSize: 16 }}>{gameName}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{formatTimeAgo(createdAt)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={getStatusIcon(status)} size={20} color={getStatusColor(status)} style={{ marginRight: 4 }} />
            <Text style={{ color: getStatusColor(status), fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>{status}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#666', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Challenged Player:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Image source={FALLBACK_AVATAR} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }} />
            <Text style={{ color: '#333', fontSize: 14, fontWeight: '500' }}>{recipientName || `Player ${requestId}`}</Text>
          </View>
        </View>

        {status.toLowerCase() === 'pending' && (
          <TouchableOpacity
            style={{ backgroundColor: '#F44336', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-end' }}
            onPress={() => handleCancelRequest(requestId)}
            activeOpacity={0.7}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Cancel Request</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [handleCancelRequest]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Container>
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        </Container>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        {requests.length > 0 ? (
          <FlatList
            data={requests}
            renderItem={renderRequest}
            keyExtractor={(item) => String(item.Id ?? item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} tintColor="#007AFF" />
            }
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="send" size={64} color="#ccc" style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 8 }}>No Sent Requests</Text>
            <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>Challenge some players to see your requests here</Text>
          </View>
        )}
      </Container>
    </SafeAreaView>
  );
};

export default SentRequestsScreen;
