import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwt');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default DashboardScreen;
