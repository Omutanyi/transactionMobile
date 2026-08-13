import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ToastAndroid, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearUser } from '../redux/userReducer';
import { request } from '../requests';
import apis from '../api';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Container } from '../components/StyledComponents';
import { useToast } from '../components/ToastProvider';
import { useTheme } from '@emotion/react';

interface Transaction {
  recipient: string;
  amount: number;
  currency: string;
  timestamp: string;
}

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  const fetchTransactions = async () => {
    try {
      const data = await request(apis.transactions, { method: 'GET' });
      setTransactions(data || []);
    } catch (e) {
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log('User role:', user);
    if (user.role === 'psp') {
      showToast('You have 5 merchants connected', 'info');
    } else if (user.role === 'dev') {
      showToast("You've made 42 API calls this week", 'info');
    }
  }, [user.role]);

  // show inline toast UI

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwt');
    dispatch(clearUser());
    navigation.navigate('Login');
  };

  useFocusEffect(
    React.useCallback(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
        </View>
      ),
    });
    }, [])
  );

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <StatusBar style="auto" />
      <Container>
        <Text style={[styles.text, { color: (theme as any).text }]}>
          Welcome to your Transaction Dashboard!
        </Text>
        <View style={{ width: '100%', marginBottom: 10 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}
            onPress={() => navigation.navigate('SendPayment')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send Payment</Text>
            <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
        {/* global toast provided by ToastProvider */}
        <FlatList
          data={transactions}
          keyExtractor={(item: any) => item.id?.toString() ?? Math.random().toString()}
          contentContainerStyle={{ width: '100%', paddingVertical: 2 }}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }: { item: any }) => (
            <View style={[styles.item, { width: 400, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }]}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  marginBottom: 4,
                  color:
                    item.type?.toLowerCase() === 'payment'
                      ? 'green'
                      : item.type?.toLowerCase() === 'refund'
                      ? 'red'
                      : '#222',
                }}
              >
                <Ionicons
                  name={item.type?.toLowerCase() === 'payment' ? 'arrow-up-circle' : item.type?.toLowerCase() === 'refund' ? 'arrow-down-circle' : 'swap-horizontal'}
                  size={14}
                  color={item.type?.toLowerCase() === 'payment' ? 'green' : item.type?.toLowerCase() === 'refund' ? 'red' : '#222'}
                  style={{ marginRight: 4 }}
                />
                {item.type?.toUpperCase() || 'TRANSACTION'}
              </Text>
              <Text>
                <Text style={{ color: '#555', fontWeight: '200' }}>To: </Text>
                <Text style={{ fontWeight: '600', color: '#222' }}>{item.recipient?.email || 'Unknown'}</Text>
              </Text>
              <Text>
                <Text style={{ color: '#555', fontWeight: '200' }}>Amount: </Text>
                <Text style={{ fontWeight: '600', color: '#222' }}>{item.amount} {item.currency}</Text>
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Text style={{ color: '#888', fontSize: 12, marginTop: 4, marginRight: 30 }}>
                  {item.created_at ? new Date(item.created_at).toLocaleString() : item.timestamp}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ alignSelf: 'center', marginTop: 20 }}>No transactions found.</Text>}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  toast: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
  },
  toastText: {
    color: '#fff',
  },
});

export default DashboardScreen;
