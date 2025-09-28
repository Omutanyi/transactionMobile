import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title } from '../../components/StyledComponents';

const UserHome = () => {
  const theme = useTheme();
  return (
    <Container>
      <Title>User Home</Title>
    </Container>
  );
};

export default UserHome;