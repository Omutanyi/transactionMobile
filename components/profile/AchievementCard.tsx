import React from 'react';
import { View } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../theme';

interface AchievementCardProps {
  title: string;
  subtitle: string;
  date: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  badge?: string;
}

const Card = styled.View<{ theme?: AppTheme }>`
  width: 120px;
  margin-right: 12px;
  padding: 16px 10px 12px;
  border-radius: 16px;
  align-items: center;
  background-color: ${({ theme }) => theme?.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme?.border};
`;

const IconCircle = styled.View<{ bgColor?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor ?? '#88888822'};
`;

const TitleText = styled.Text<{ theme?: AppTheme }>`
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme }) => theme?.text};
  text-align: center;
  margin-top: 8px;
`;

const SubtitleText = styled.Text<{ theme?: AppTheme }>`
  font-size: 9px;
  color: ${({ theme }) => theme?.subText};
  text-align: center;
  margin-top: 3px;
  line-height: 13px;
`;

const DateText = styled.Text<{ theme?: AppTheme }>`
  font-size: 9px;
  color: ${({ theme }) => theme?.subText};
  text-align: center;
  margin-top: 4px;
`;

const BadgeCircle = styled.View<{ color?: string }>`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color ?? '#007AFF'};
`;

const BadgeText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #fff;
`;

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  subtitle,
  date,
  iconName,
  iconColor = '#FFD700',
  badge,
}) => {
  const theme = useTheme() as AppTheme;
  return (
    <Card theme={theme}>
      <View>
        <IconCircle bgColor={iconColor + '33'}>
          <Ionicons name={iconName} size={28} color={iconColor} />
        </IconCircle>
        {badge && (
          <BadgeCircle color={iconColor}>
            <BadgeText>{badge}</BadgeText>
          </BadgeCircle>
        )}
      </View>
      <TitleText theme={theme}>{title}</TitleText>
      <SubtitleText theme={theme}>{subtitle}</SubtitleText>
      <DateText theme={theme}>{date}</DateText>
    </Card>
  );
};

export default AchievementCard;
