import React from 'react';
import { useTheme } from '@emotion/react';
import { Container, Title } from '../../components/StyledComponents';
import Carousel from '../../components/Carrousel';
import { Image, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const gamingLogo = require('../../assets/gaming.jpg');
const logo = require('../../assets/ic_launcher.png');

const images = [
  require('../../assets/avatar.jpg'),
  require('../../assets/profile.jpg'),
  require('../../assets/ic_launcher.png'),
  require('../../assets/icon.png'),
];

const { width } = Dimensions.get('window');

const dummyFeeds = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  userName: `Xgahe !he${i + 1}`,
  userPic: images[i % images.length],
  activityTitle: `Played a match in ${['FIFA', 'PES', 'Rocket League', 'Valorant'][i % 4]}`,
  date: `2025-09-${(i % 30) + 1}`,
  game: ['FIFA', 'PES', 'Rocket League', 'Valorant'][i % 4],
}));

const Stack = createStackNavigator();

const UserHomeContent = () => {
  const theme = useTheme() as any;
  const navigation = useNavigation() as any;
  
  const handlePlayMatchPress = () => {
    navigation.navigate('OneOnOneMatch');
  };

  return (
    <Container>
      <Carousel 
        height={150}
        autoSlide={true}
        slideInterval={4000}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 }}>
        {/* Tournaments View */}
        <View
          style={{
        backgroundColor: 'blue',
        borderRadius: 16,
        width: (width * 0.9 - 20) / 2,
        height: 120,
        padding: 16,
        position: 'relative',
        justifyContent: 'center',
          }}
        >
          <View style={{ position: 'absolute', top: 12, right: 12 }}>
             <Ionicons name={'people-outline'} size={24} color={'white'} />
          </View>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Tournaments</Text>
        </View>
        {/* Play Match View */}
        <TouchableOpacity
          style={{
        backgroundColor: 'blue',
        borderRadius: 16,
        width: (width * 0.9 - 20) / 2,
        height: 120,
        padding: 16,
        position: 'relative',
        justifyContent: 'center',
          }}
          onPress={handlePlayMatchPress}
          activeOpacity={0.8}
        >
          <View style={{ position: 'absolute', top: 12, right: 12 }}>
             <Ionicons name={'football-outline'} size={24} color={'white'} />
          </View>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Play Match</Text>
        </TouchableOpacity>
      </View>
      {/* Activity Feeds Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', textAlign: 'left' }}>Activity Feeds</Text>
        <Text style={{ color: theme.primary, fontSize: 14, fontWeight: 'bold' }}>View All</Text>
      </View>
      <View style={{ maxHeight: 400 }}>
        <ScrollView>
          {dummyFeeds.map(feed => (
            <View key={feed.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: theme.inputBackground, borderRadius: 12, padding: 10 }}>
              <Image source={feed.userPic} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: theme.primary }}>{feed.userName}</Text>
                <Text style={{ color: theme.inputText }}>{feed.activityTitle}</Text>
                <Text style={{ color: theme.inputBorder, fontSize: 12 }}>{feed.date} | {feed.game}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Container>
  );
};

const UserHome = () => {
  const theme = useTheme() as any;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'ProGamer',
        headerLeft: () => (
          <Image
            source={logo}
            style={{ width: 32, height: 32, marginLeft: 16 }}
          />
        ),
        headerRight: () => (
          <Ionicons
            name="notifications-outline"
            size={28}
            color={theme.primary}
            style={{ marginRight: 16 }}
          />
        ),
      }}
    >
      <Stack.Screen name="ProGamer" component={UserHomeContent} />
    </Stack.Navigator>
  );
};

export default UserHome;