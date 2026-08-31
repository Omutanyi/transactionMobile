import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearStoredSession = async () => {
  await AsyncStorage.removeItem('jwt');
  await AsyncStorage.removeItem('rememberedIdentifier');
};
