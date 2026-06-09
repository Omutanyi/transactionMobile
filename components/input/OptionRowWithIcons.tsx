import React from 'react';
import { View } from 'react-native';
import styled from '@emotion/native';
import { AppTheme } from '../../theme';

export const OptionRowWithIcons = styled.TouchableOpacity<{ theme?: AppTheme }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 18px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme?.inputBorder};
  padding-horizontal: 8px;
`;

export const IconWrapper = styled.View<{ theme?: AppTheme }>`
  width: 32px;
  align-items: center;
  justify-content: center;
`;

export const OptionText = styled.Text<{ theme?: AppTheme }>`
  font-size: 15px;
  color: ${({ theme }) => theme?.text};
  flex: 1;
  margin-left: 8px;
`;
