import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ToastAndroid, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, clearUser } from '../store';
import { request } from '../requests';
import apis from '../api';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

interface Transaction {
  recipient: string;
  amount: number;
  currency: string;
  timestamp: string;
}

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
      setToast('You have 5 merchants connected');
    } else if (user.role === 'dev') {
      setToast("You've made 42 API calls this week");
    }
    if (user.role) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [user.role]);

  useEffect(() => {
    if (toast && Platform.OS === 'android') {
      ToastAndroid.show(toast, ToastAndroid.SHORT);
    }
  }, [toast]);

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
      <View style={styles.container}>
        <Text style={styles.text}>
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
        {toast && Platform.OS !== 'android' && (
          <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>
        )}
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
      </View>
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
