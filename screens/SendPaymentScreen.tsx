import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, ToastAndroid, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { request } from '../requests';
import apis from '../api';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container}>
      <Text style={styles.title}>
        Send Payment 
      </Text>
      <Text style={styles.label}>Recipient</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={recipient}
          onValueChange={setRecipient}
          style={[styles.picker, { paddingLeft: 30 }]}
        >
          <Picker.Item label="Select recipient" value="" />
          {users.map((u) => (
            <Picker.Item key={u.email} label={u.email} value={u.id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Amount</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="cash-outline" size={18} color="#007bff" style={{ marginRight: 6 }} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
      </View>
      <Text style={styles.label}>Currency</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={currency}
          onValueChange={setCurrency}
          style={[styles.picker, { paddingLeft: 30 }]}
        >
          {currencies.map((cur) => (
            <Picker.Item key={cur} label={cur} value={cur} />
          ))}
        </Picker>
      </View>
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
      {toast && Platform.OS !== 'android' && (
        <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    // height: 44,
    width: '100%',
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
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
  },
});

export default SendPaymentScreen;
