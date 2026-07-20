import React from 'react';
import { View } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../theme';

export interface RankMilestone {
  name: string;
  range: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  active?: boolean;
  completed?: boolean;
  locked?: boolean;
}

interface RankProgressBarProps {
  milestones: RankMilestone[];
}

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const MilestoneCol = styled.View`
  align-items: center;
  flex: 1;
`;

const NodeCircle = styled.View<{ borderColor?: string; bgColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ borderColor }) => borderColor ?? '#ccc'};
  background-color: ${({ bgColor }) => bgColor ?? 'transparent'};
`;

const RankName = styled.Text<{ theme?: AppTheme; active?: boolean }>`
  font-size: 10px;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  color: ${({ theme, active }) => (active ? theme?.text : theme?.subText)};
  margin-top: 6px;
`;

const RangeText = styled.Text<{ theme?: AppTheme }>`
  font-size: 8px;
  color: ${({ theme }) => theme?.subText};
  margin-top: 1px;
`;

const RankProgressBar: React.FC<RankProgressBarProps> = ({ milestones }) => {
  const theme = useTheme() as AppTheme;

  return (
    <Row>
      {milestones.map((m, idx) => (
        <React.Fragment key={m.name}>
          {idx > 0 && (
            <View
              style={{
                flex: 1,
                height: 2,
                marginTop: 18,
                backgroundColor: m.completed || m.active ? m.color : theme.border,
              }}
            />
          )}
          <MilestoneCol>
            <NodeCircle
              borderColor={m.locked ? theme.border : m.color}
              bgColor={
                m.active
                  ? m.color + '33'
                  : m.completed
                  ? m.color + '22'
                  : theme.card
              }
            >
              <Ionicons
                name={m.locked ? 'lock-closed-outline' : m.iconName}
                size={18}
                color={m.locked ? theme.subText : m.color}
              />
            </NodeCircle>
            <RankName theme={theme} active={m.active}>{m.name}</RankName>
            <RangeText theme={theme}>{m.range}</RangeText>
          </MilestoneCol>
        </React.Fragment>
      ))}
    </Row>
  );
};

export default RankProgressBar;
