import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title } from '../../components/StyledComponents';

const UserCommunity = () => {
  const theme = useTheme();
  return (
    <Container>
      <Title>User Community</Title>
    </Container>
  );
};

export default UserCommunity;