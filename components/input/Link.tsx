import React from 'react';
import { LinkText } from '../StyledComponents';

interface LinkProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}

const Link: React.FC<LinkProps> = ({ onPress, children, style }) => (
  <LinkText onPress={onPress} style={style}>
    {children}
  </LinkText>
);

export default Link;
