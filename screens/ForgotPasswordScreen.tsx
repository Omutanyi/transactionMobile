import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { Container, Title, ButtonWrapper } from '../components/StyledComponents';
import { useToast } from '../components/ToastProvider';
import InputWithIcon from '../components/input/InputWithIcon';
import ButtonWithIcon from '../components/input/ButtonWithIcon';
import { request } from '../requests';
import apis from '../api';

interface Props {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }
    setLoading(true);
    try {
      await request(apis.forgotPassword, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      showToast('If this email exists, a reset link has been sent.', 'success');
    } catch (e: any) {
      showToast(e?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title style={{ color: (theme as any).primary }}>Forgot Password</Title>
      <InputWithIcon
        icon={<Ionicons name="mail-outline" size={20} color={(theme as any).inputText} />}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {/* global toast shown by provider */}
      <ButtonWrapper>
        <ButtonWithIcon
          title={loading ? 'Sending...' : 'Send Reset Link'}
          onPress={handleReset}
          icon={<Ionicons name="send-outline" size={20} color={(theme as any).buttonText} />}
          bgColor={(theme as any).button}
          disabled={loading}
        />
      </ButtonWrapper>
      <ButtonWrapper>
        <ButtonWithIcon
          title="Back to Login"
          onPress={() => navigation.navigate('Login')}
          icon={<Ionicons name="arrow-back-outline" size={20} color={(theme as any).buttonText} />}
          bgColor={(theme as any).button}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default ForgotPasswordScreen;
