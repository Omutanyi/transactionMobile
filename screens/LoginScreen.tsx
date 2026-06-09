import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { request } from '../requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apis from '../api';
import { RootState } from '../redux/store';
import { setUser } from '../redux/userReducer';
import { useDispatch } from 'react-redux';
import { Container, LogoWrapper, StyledImage, ErrorText, ButtonWrapper, Title } from '../components/StyledComponents';
import InputWithIcon from '../components/input/InputWithIcon';
import { Ionicons } from '@expo/vector-icons';
import ButtonWithIcon from '../components/input/ButtonWithIcon';
import Link from '../components/input/Link';
import SocialLoginOptions from '../components/input/SocialLoginOptions';
import styled from '@emotion/native';

interface Props {
    navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            console.log('Attempting to login with:', { email, username, password, apisLogin: apis.login });
            const data = await request(apis.login, {
                method: 'POST',
                body: JSON.stringify({ email, username, password }),
            });
            if (data && data.token) {
                await AsyncStorage.setItem('jwt', data.token);
                // Fetch user profile after login
                const profile = await request(apis.getProfile, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${data.token}` },
                });
                dispatch(setUser({
                    email: profile?.Email,
                    username: profile?.Username,
                    role: profile?.role?.RoleName,
                    ...profile,
                }));
                if (profile?.role?.RoleName !== 'Admin') {
                    navigation.navigate('AdminDashboard');
                } else {
                    navigation.navigate('UserDashboard');
                }
            }
        } catch (e: any) {
            setError(e?.message || 'An unexpected error occurred');
            console.error('Login error:', e);
        }
    };

    return (
        <Container>
            <LogoWrapper>
                <StyledImage source={require('../assets/ic_launcher.png')} />
            </LogoWrapper>
            <Title>Login</Title>
            <InputWithIcon
                icon={<Ionicons name="person-outline" size={20} color="#888" />}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            {/* <InputWithIcon
                icon={<Ionicons name="mail-outline" size={20} color="#888" />}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            /> */}
            <InputWithIcon
                icon={<Ionicons name="lock-closed-outline" size={20} color="#888" />}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <ErrorText>{error}</ErrorText> : null}
            <Link onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Link>
            <ButtonWrapper>
                <ButtonWithIcon
                    title="Login"
                    onPress={handleLogin}
                    icon={<Ionicons name="log-in-outline" size={20} color="#fff" />}
                    bgColor="#007AFF"
                />
            </ButtonWrapper>
            <SocialLoginOptions
                onGoogle={() => {}}
                onFacebook={() => {}}
                onMicrosoft={() => {}}
            />
            <Link onPress={() => navigation.navigate('Signup')} style={{ marginTop: 10 }}>
                New to site? <Text style={{ textDecorationLine: 'underline', color: '#007AFF' }}>Register now</Text>
            </Link>
        </Container>
    );
};

export default LoginScreen;
