import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, ToastAndroid, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { request } from '../requests';
import apis from '../api';
import { Ionicons } from '@expo/vector-icons';
import { Container, StyledInput, ErrorText, ButtonWrapper } from '../components/StyledComponents';

const currencies = ['USD', 'EUR', 'GBP'];

const SendPaymentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(currencies[0]);
  const [users, setUsers] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await request(apis.users, { method: 'GET' });
        setUsers((data || []).filter((u: any) => u.email !== user.email));
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [user.email]);

  const handleSend = async () => {
    if (!recipient || !amount || !currency) {
      setToast('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await request(apis.send, {
        method: 'POST',
        body: JSON.stringify({ recipient_id: recipient, amount: parseFloat(amount), currency, type: 'payment' }),
      });
      setToast('Payment sent successfully!');
      setAmount('');
      setRecipient('');
    } catch (e: any) {
      setToast(e.message || 'Failed to send payment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toast && Platform.OS === 'android') {
      ToastAndroid.show(toast, ToastAndroid.SHORT);
    }
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <Container>
      <Text style={styles.title}>
        Send Payment 
      </Text>
      <StyledInput
        placeholder="Recipient"
        value={recipient}
        onChangeText={setRecipient}
      />
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
      {toast ? <ErrorText>{toast}</ErrorText> : null}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SendPaymentScreen;
