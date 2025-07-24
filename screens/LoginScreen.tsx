import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { request } from '../requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apis from '../api';
import { setUser } from '../store';
import { useDispatch } from 'react-redux';

interface Props {
    navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const data = await request(apis.login, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            if (data && data.token) {
                await AsyncStorage.setItem('jwt', data.token);
                dispatch(setUser({ email: data.user?.email, role: data.user?.role }));
                navigation.navigate('Dashboard');
            }
        } catch (e: any) {
            setError(e?.message || 'An unexpected error occurred');
            console.error('Login error:', e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Image
                source={require('../assets/transactlogo.png')}
                style={{ width: 100, height: 100, resizeMode: 'contain' }}
            />
            </View>
            <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            />
            <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={{ marginBottom: 15 }}>
            <Button title="Login" onPress={handleLogin} color="#007AFF" />
            </View>
            <View style={{ marginBottom: 15 }}>
            <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} color="#007AFF" />
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

export default LoginScreen;
