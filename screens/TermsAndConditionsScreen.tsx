import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Container, Title } from '../components/StyledComponents';
import { useTheme } from '@emotion/react';

const TermsAndConditionsScreen: React.FC = () => {
  const theme = useTheme() as import('../theme').AppTheme;
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Terms and Conditions</Title>
        <Text style={{ color: theme.text, marginBottom: 16 }}>
          Welcome to our app! By using this application, you agree to the following terms and conditions. This is a sample placeholder for your actual terms and conditions. Please replace this text with your real legal content.
        </Text>
        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: 'bold' }}>1. Acceptance of Terms</Text>
        <Text style={{ color: theme.text, marginBottom: 8 }}>
          By accessing or using the app, you agree to be bound by these terms.
        </Text>
        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: 'bold' }}>2. User Responsibilities</Text>
        <Text style={{ color: theme.text, marginBottom: 8 }}>
          You agree to use the app in compliance with all applicable laws and regulations.
        </Text>
        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: 'bold' }}>3. Changes to Terms</Text>
        <Text style={{ color: theme.text, marginBottom: 8 }}>
          We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of the new terms.
        </Text>
      </ScrollView>
    </Container>
  );
};

export default TermsAndConditionsScreen;
