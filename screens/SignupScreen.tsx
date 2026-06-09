import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { request } from '../requests';
import apis from '../api';
import { RootState } from '../redux/store';
import { Container, ErrorText, ButtonWrapper, Title, DividerRow, DividerLine, DividerText, LinkText } from '../components/StyledComponents';
import InputWithIcon from '../components/input/InputWithIcon';
import ButtonWithIcon from '../components/input/ButtonWithIcon';
import SocialLoginOptions from '../components/input/SocialLoginOptions';
import { Ionicons } from '@expo/vector-icons';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

interface Props {
  navigation: any;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    const url = apis.signup;
    console.log('Signup URL:', url);
    console.log('Signup Data:', { email, username, phone, password });
    try {
      await request(url, {
        method: 'POST',
        body: JSON.stringify({ email, username, phone, password, role: "psp" }),
      });
      navigation.navigate('Login');
    } catch (e: any) {
      setError(e?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Container>
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Image
          source={require('../assets/ic_launcher.png')}
          style={{ width: 80, height: 80 }}
        />
      </View>
      <Title>Signup</Title>
      <SocialLoginOptions />
      <DividerRow>
        <DividerLine style={{ backgroundColor: (theme as any).border }} />
        <DividerText>Or, register with email...</DividerText>
        <DividerLine style={{ backgroundColor: (theme as any).border }} />
      </DividerRow>
      <InputWithIcon
        icon={<Ionicons name="mail-outline" size={20} color={(theme as any).icon} />}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <InputWithIcon
        icon={<Ionicons name="person-outline" size={20} color={(theme as any).icon} />}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <InputWithIcon
        icon={<Ionicons name="call-outline" size={20} color={(theme as any).icon} />}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <InputWithIcon
        icon={<Ionicons name="lock-closed-outline" size={20} color={(theme as any).icon} />}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <ButtonWrapper>
        <ButtonWithIcon
          title="Signup"
          onPress={handleSignup}
          icon={<Ionicons name="person-add-outline" size={20} color="#fff" />}
          bgColor={(theme as any).primary || '#007AFF'}
        />
      </ButtonWrapper>
      <ButtonWrapper style={{ alignItems: 'center' }}>
        <LinkText onPress={() => navigation.navigate('TermsAndConditions')}>
          Terms and Conditions
        </LinkText>
      </ButtonWrapper>
      <ButtonWrapper style={{ alignItems: 'center' }}>
        <LinkText onPress={() => navigation.navigate('Login')}>
          Back to Login
        </LinkText>
      </ButtonWrapper>
    </Container>
  );
};

// Removed unused StyleSheet since all styling is via StyledComponents

export default SignupScreen;
