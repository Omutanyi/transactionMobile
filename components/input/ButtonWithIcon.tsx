import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import styled from '@emotion/native';

const StyledButton = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || '#007AFF'};
  padding: 14px;
  border-radius: 5px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled.Text<{ color?: string }>`
  color: ${({ color }) => color || '#fff'};
  font-weight: bold;
  font-size: 16px;
`;

interface ButtonWithIconProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  title,
  onPress,
  icon,
  color = '#fff',
  bgColor = '#007AFF',
  loading = false,
  style,
  textStyle,
  disabled = false,
}) => (
  <StyledButton onPress={onPress} bgColor={bgColor} style={style} disabled={disabled || loading} activeOpacity={0.8}>
    {loading ? (
      <ActivityIndicator color={color} style={{ marginLeft: icon ? 8 : 0 }} />
    ) : (
      <ButtonText color={color} style={[icon ? { marginLeft: 8 } : {}, textStyle]}>{title}</ButtonText>
    )}
    <View style={{ marginLeft: 10 }}>{icon}</View>
  </StyledButton>
);

export default ButtonWithIcon;
