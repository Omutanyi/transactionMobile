import React from 'react';
import { Container, Title, AvatarImage, OptionRow, OptionText } from '../../../components/StyledComponents';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const dummyFeeds = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  user: {
    name: `User${i + 1}`,
    username: `@user${i + 1}`,
    profilePic: require('../../../assets/avatar.jpg'),
  },
  message: `This is a sample message from User${i + 1}. Enjoy the community!`,
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 50),
  shares: Math.floor(Math.random() * 20),
}));

const FeedItem = ({ item }: { item: typeof dummyFeeds[0] }) => (
<View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
    <AvatarImage source={item.user.profilePic} style={{ marginRight: 12, width: 36, height: 36 }} />
    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.user.name}</Text>
            <Text style={{ color: '#888', marginLeft: 8 }}>{item.user.username}</Text>
        </View>
        <Text style={{ fontSize: 15, marginBottom: 8 }}>{item.message}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="heart-outline" size={20} color="#e0245e" />
                <Text style={{ marginLeft: 4 }}>{item.likes}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="chatbubble-outline" size={20} color="#1da1f2" />
                <Text style={{ marginLeft: 4 }}>{item.comments}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="share-social-outline" size={20} color="#17bf63" />
                <Text style={{ marginLeft: 4 }}>{item.shares}</Text>
            </View>
        </View>
    </View>
</View>
);

const HomeScreen = () => (
  <Container>
    {/* <Title>Community Feed</Title> */}
    <FlatList
      data={dummyFeeds}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <FeedItem item={item} />}
      showsVerticalScrollIndicator={false}
    />
  </Container>
);

export { HomeScreen };
