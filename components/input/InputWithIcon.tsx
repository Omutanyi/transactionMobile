import React from 'react';
import { View, KeyboardTypeOptions } from 'react-native';
import { StyledInput } from '../StyledComponents';
import styled from '@emotion/native';

const InputWrapper = styled.View`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const IconContainer = styled.View`
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const StyledInputWithIcon = styled(StyledInput)`
  padding-left: 38px;
`;

interface InputWithIconProps {
  icon: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType,
}) => (
  <InputWrapper>
    <IconContainer>{icon}</IconContainer>
    <StyledInputWithIcon
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
    />
  </InputWrapper>
);

export default InputWithIcon;
