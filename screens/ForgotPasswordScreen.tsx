import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { Container, Title, ErrorText, ButtonWrapper } from '../components/StyledComponents';
import InputWithIcon from '../components/input/InputWithIcon';
import ButtonWithIcon from '../components/input/ButtonWithIcon';

interface Props {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Simulate API call
      setTimeout(() => {
        setMessage('If this email exists, a reset link has been sent.');
        setLoading(false);
      }, 1200);
    } catch (e) {
      setMessage('Something went wrong. Please try again.');
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
      />
      {message ? <ErrorText>{message}</ErrorText> : null}
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
