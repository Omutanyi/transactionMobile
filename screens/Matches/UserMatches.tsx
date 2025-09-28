import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title } from '../../components/StyledComponents';

const UserMatches = () => {
  const theme = useTheme();
  return (
    <Container>
      <Title>User Matches</Title>
    </Container>
  );
};

export default UserMatches;