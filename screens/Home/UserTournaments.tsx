import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title} from '../../components/StyledComponents';

const UserTournaments = () => {
  const theme = useTheme();
  return (
    <Container>
      <Title>My Tournaments</Title>
    </Container>
  );
};

export default UserTournaments;