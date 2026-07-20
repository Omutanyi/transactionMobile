import React from 'react';
import { ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '../../theme';

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
  color,
  bgColor,
  loading = false,
  style,
  textStyle,
  disabled = false,
}) => {
  const theme = useTheme() as AppTheme;
  const resolvedBgColor = bgColor ?? theme.button;
  const resolvedColor = color ?? theme.buttonText;

  return (
    <StyledButton onPress={onPress} bgColor={resolvedBgColor} style={style} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={resolvedColor} style={{ marginLeft: icon ? 8 : 0 }} />
      ) : (
        <ButtonText color={resolvedColor} style={[icon ? { marginLeft: 8 } : {}, textStyle]}>{title}</ButtonText>
      )}
      <View style={{ marginLeft: 10 }}>{icon}</View>
    </StyledButton>
  );
};

export default ButtonWithIcon;
