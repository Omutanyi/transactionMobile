import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { request } from '../requests';
import apis from '../api';

interface Props {
  navigation: any;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      await request(apis.signup, {
        method: 'POST',
        body: JSON.stringify({ email, password, role: "psp" }),
      });
      navigation.navigate('Login');
    } catch (e: any) {
      setError(e.message);
    }
  };

return (
    <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Image
                source={require('../assets/transactlogo.png')}
                style={{ width: 80, height: 80 }}
            />
        </View>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={{ marginVertical: 8 }}>
            <Button title="Signup" onPress={handleSignup} />
        </View>
        <View style={{ marginVertical: 8 }}>
            <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
        </View>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignupScreen;
