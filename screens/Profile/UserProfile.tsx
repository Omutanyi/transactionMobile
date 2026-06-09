import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title, StyledImage, AvatarImage, BottomContainer } from '../../components/StyledComponents';
import { OptionRowWithIcons, IconWrapper, OptionText } from '../../components/input/OptionRowWithIcons';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import logo from '../../assets/ic_launcher.png';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const options = [
  { label: 'Followers', screen: 'Followers' },
  { label: 'Following', screen: 'Following' },
  { label: 'Personal Info', screen: 'PersonalInfo' },
  { label: 'Payment Methods', screen: 'PaymentMethods' },
  { label: 'Security', screen: 'Security' },
  { label: 'Location', screen: 'Location' },
  { label: 'Notifications', screen: 'Notifications' },
  { label: 'Account', screen: 'Account' },
  { label: 'Help', screen: 'Help' },
];

const Stack = createStackNavigator();

const UserProfileContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  // Example user data (replace with real data as needed)
  const user = {
    username: 'Omega La Don',
    followers: 1200,
    following: 350,
    matches: 48,
    rank: 'Gold',
  };

  return (
    <Container style={{ padding: 0 }}>
      {/* Profile Card */}
      <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: (theme as any).card,
        borderRadius: 20,
        marginTop: 20,
        marginHorizontal: 20,
        // margin: 20,
        // padding: 20,
      }}
      >
      {/* Left: Avatar */}
      <AvatarImage
        source={require('../../assets/avatar.jpg')}
        style={{ width: 90, height: 90, borderRadius: 45, marginRight: 4 }}
      />
      {/* Right: User Details */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {/* <Ionicons name="person-circle-outline" size={22} color={(theme as any).primary} style={{ marginRight: 8 }} /> */}
        <Text style={{ fontWeight: 'semi-bold', fontSize: 18 }}>{user.username}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Ionicons name="people-outline" size={18} color={(theme as any).primary} style={{ marginRight: 6 }} />
        <Text style={{ marginRight: 12 }}>Followers: {user.followers}</Text>
        <Ionicons name="person-add-outline" size={18} color={(theme as any).primary} style={{ marginRight: 6 }} />
        <Text>Following: {user.following}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Ionicons name="game-controller-outline" size={18} color={(theme as any).primary} style={{ marginRight: 6 }} />
        <Text style={{ marginRight: 12 }}>Matches: {user.matches}</Text>
        <Ionicons name="trophy-outline" size={18} color={(theme as any).primary} style={{ marginRight: 6 }} />
        <Text>Rank: {user.rank}</Text>
        </View>
        <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: (theme as any).primary,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 16,
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('EditProfile')}
        >
        <Ionicons name="create-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      </View>
      {/* Options List */}
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

const UserProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Profile',
        headerLeft: () => (
          <AvatarImage source={logo} style={{ width: 32, height: 32, marginLeft: 16 }} />
        ),
        headerRight: () => (
          <Ionicons
            name="notifications-outline"
            size={28}
            color={(theme as any).primary}
            style={{ marginRight: 16 }}
          />
        ),
      }}
    >
      <Stack.Screen name="ProfileMain" options={{ headerTitle: 'Profile' }}>
        {props => <UserProfileContent {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default UserProfile;
