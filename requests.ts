import AsyncStorage from '@react-native-async-storage/async-storage';

export async function request(url: string, options: RequestInit = {}) {
    const token = await AsyncStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API Error');
    return data;
}
