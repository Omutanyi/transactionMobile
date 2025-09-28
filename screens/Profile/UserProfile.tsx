import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title, StyledImage, AvatarImage, BottomContainer } from '../../components/StyledComponents';
import { OptionRowWithIcons, IconWrapper, OptionText } from '../../components/input/OptionRowWithIcons';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const options = [
  { label: 'Personal Info', screen: 'PersonalInfo' },
  { label: 'Location', screen: 'Location' },
  { label: 'Notifications', screen: 'Notifications' },
  { label: 'Account', screen: 'Account' },
  { label: 'Help', screen: 'Help' },
];

const UserProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <Container style={{ padding: 0 }}>
      <StyledImage
        source={require('../../assets/profile.jpg')}
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 3, position: 'absolute', top: 0, left: 0 }}
        resizeMode="cover"
      />
      <AvatarImage
        source={require('../../assets/avatar.jpg')}
        style={{ alignSelf: 'center', marginTop: Dimensions.get('window').height / 4.2, marginBottom: 20 }}
      />
      <BottomContainer>
        {options.map((opt, idx) => (
          <OptionRowWithIcons key={opt.screen} onPress={() => navigation.navigate(opt.screen)}>
            <IconWrapper>
              <Ionicons name={idx % 2 === 0 ? 'person-outline' : 'location-outline'} size={22} color={(theme as any).primary} />
            </IconWrapper>
            <OptionText>{opt.label}</OptionText>
            <IconWrapper>
              <Ionicons name="chevron-forward-outline" size={22} color={(theme as any).text} />
            </IconWrapper>
          </OptionRowWithIcons>
        ))}
      </BottomContainer>
    </Container>
  );
};

export default UserProfile;
