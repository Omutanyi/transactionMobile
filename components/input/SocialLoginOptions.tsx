import React from 'react';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { SocialRow, SocialIconButton } from '../StyledComponents';

interface SocialLoginOptionsProps {
  onGoogle?: () => void;
  onFacebook?: () => void;
  onMicrosoft?: () => void;
}

const SocialLoginOptions: React.FC<SocialLoginOptionsProps> = ({ onGoogle, onFacebook, onMicrosoft }) => (
  <SocialRow>
    <SocialIconButton onPress={onGoogle}>
      <AntDesign name="google" size={24} color="#EA4335" />
    </SocialIconButton>
    <SocialIconButton onPress={onFacebook}>
      <FontAwesome name="facebook" size={24} color="#1877F3" />
    </SocialIconButton>
    <SocialIconButton onPress={onMicrosoft}>
      <Ionicons name="logo-microsoft" size={24} color="#5E5E5E" />
    </SocialIconButton>
  </SocialRow>
);

export default SocialLoginOptions;
