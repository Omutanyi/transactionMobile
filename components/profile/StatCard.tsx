import React from 'react';
import { Text } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../theme';

interface StatCardProps {
  label: string;
  value: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  highlight?: boolean;
}

const Card = styled.View<{ theme?: AppTheme; highlight?: boolean }>`
  flex: 1;
  margin: 4px;
  padding: 12px 6px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, highlight }) =>
    highlight ? (theme?.secondary + '22') : theme?.statCard};
`;

const ValueText = styled.Text<{ theme?: AppTheme }>`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme?.text};
  margin-top: 4px;
`;

const LabelText = styled.Text<{ theme?: AppTheme }>`
  font-size: 10px;
  color: ${({ theme }) => theme?.subText};
  text-align: center;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatCard: React.FC<StatCardProps> = ({ label, value, iconName, iconColor, highlight }) => {
  const theme = useTheme() as AppTheme;
  return (
    <Card theme={theme} highlight={highlight}>
      <Ionicons name={iconName} size={20} color={iconColor ?? theme.primary} />
      <ValueText theme={theme}>{value}</ValueText>
      <LabelText theme={theme}>{label}</LabelText>
    </Card>
  );
};

export default StatCard;
