import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';

interface StackScreenConfig {
  name: string;
  component: React.ComponentType<any>;
  title?: string;
}

interface DashboardStackProps {
  screens: StackScreenConfig[];
}

const Stack = createStackNavigator();

const Header = styled.View`
  width: 100%;
  padding: 18px 0 12px 0;
  background-color: ${({ theme }) => (theme as any)?.primary || '#007AFF'};
  align-items: center;
  justify-content: center;
`;

const HeaderText = styled.Text`
  color: #fff;
  font-size: 22px;
  font-weight: bold;
`;

export const DashboardStack: React.FC<DashboardStackProps> = ({ screens }) => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      {screens.map(({ name, component, title }, idx) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={{
            header: () => (
              <Header theme={theme}>
                <HeaderText>{title || name}</HeaderText>
              </Header>
            ),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
