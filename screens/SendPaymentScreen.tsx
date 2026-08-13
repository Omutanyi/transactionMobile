import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ToastAndroid, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { request } from '../requests';
import apis from '../api';
import { Ionicons } from '@expo/vector-icons';
import { Container, StyledInput, ButtonWrapper } from '../components/StyledComponents';
import { useToast } from '../components/ToastProvider';

const currencies = ['USD', 'EUR', 'GBP'];

const SendPaymentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user);
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(currencies[0]);
  const [users, setUsers] = useState<any[]>([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await request(apis.transactionUsers, { method: 'GET' });
        const list = Array.isArray(data) ? data : data?.users ?? data?.data ?? [];
        setUsers(list.filter((u: any) => u.Id != (user as any).id && (u.Username !== user.username)));
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [user.username]);

  const handleSend = async () => {
    if (!recipientId || !amount) {
      showToast('Recipient and amount are required', 'error');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    setLoading(true);
    try {
      await request(apis.sendPayment, {
        method: 'POST',
        body: JSON.stringify({ recipientId: parseInt(recipientId), amount: amt, currency, type: 'payment' }),
      });
      showToast('Payment sent successfully!', 'success');
      setAmount('');
      setRecipientId('');
    } catch (e: any) {
      showToast(e.message || 'Failed to send payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Text style={styles.title}>Send Payment</Text>

      <Text style={styles.label}>Recipient</Text>
      <View style={styles.pickerWrapper}>
        {users.map(u => (
          <TouchableOpacity
            key={u.Id}
            style={[styles.userItem, recipientId === String(u.Id) && styles.userItemActive]}
            onPress={() => setRecipientId(String(u.Id))}
          >
            <Ionicons name="person-outline" size={16} color={recipientId === String(u.Id) ? '#fff' : '#666'} />
            <Text style={[styles.userItemText, recipientId === String(u.Id) && styles.userItemTextActive]}>
              {u.Username || u.FullName || u.Email || `User ${u.Id}`}
            </Text>
          </TouchableOpacity>
        ))}
        {users.length === 0 && (
          <Text style={styles.noUsersText}>No users available</Text>
        )}
      </View>

      <StyledInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <StyledInput
        placeholder="Currency"
        value={currency}
        onChangeText={setCurrency}
      />
      {/* global toast shown by provider */}
      <ButtonWrapper>
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#aaa', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}
          onPress={handleSend}
          disabled={loading}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="paper-plane" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Payment'}</Text>
          </View>
        </TouchableOpacity>
      </ButtonWrapper>
    </Container>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#666' },
  pickerWrapper: { marginBottom: 12 },
  userItem: {
    flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 4,
    backgroundColor: '#f0f0f0', borderRadius: 8,
  },
  userItemActive: { backgroundColor: '#007bff' },
  userItemText: { fontSize: 14, color: '#333', marginLeft: 8 },
  userItemTextActive: { color: '#fff' },
  noUsersText: { fontSize: 13, color: '#999', textAlign: 'center', padding: 10 },
  button: {
    backgroundColor: '#007bff', padding: 14, borderRadius: 5,
    alignItems: 'center', marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default SendPaymentScreen;
