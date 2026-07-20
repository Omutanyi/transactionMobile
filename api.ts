import Constants from 'expo-constants';

type AppConfig = {
  BASE_URL: string;
};
const { BASE_URL } = Constants.expoConfig?.extra as AppConfig;

const baseUrl = BASE_URL || 'http://localhost:3000';

console.log('API Base URL:', baseUrl);

type ApiEndpoints = {
    login: string;
    signup: string;
    getUser: string;
    transactions: string;
    send: string;
    users: string;
    getProfile: string;
    updateProfile: string;
    games: string;
    (endpoint: string): string;
};

const apis = ((endpoint: string) => `${baseUrl}${endpoint}`) as ApiEndpoints;

apis.login = apis('/auth/login');
apis.signup = apis('/auth/register');
apis.getUser = apis('/auth/user');
apis.transactions = apis('transaction/transactions');
apis.send = apis('/transaction/send');
apis.users = apis('/auth/users');
apis.getProfile = apis('/auth/profile');
apis.updateProfile = apis('/auth/profile');
apis.games = apis('/game');

export default apis;