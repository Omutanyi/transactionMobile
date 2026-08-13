import Constants from 'expo-constants';

type AppConfig = {
  BASE_URL: string;
};
const { BASE_URL } = Constants.expoConfig?.extra as AppConfig;

const baseUrl = BASE_URL || 'http://localhost:3000';

console.log('API Base URL:', baseUrl);

type ApiEndpoints = {
    // Auth
    login: string;
    signup: string;
    getUser: string;
    getProfile: string;
    updateProfile: string;
    profileImage: string;
    users: string;
    forgotPassword: string;
    resetPassword: string;
    googleLogin: string;
    phoneOtp: string;
    verifyOtp: string;

    // Games
    games: string;

    // Tournaments
    tournaments: string;
    tournamentDetail: (id: string | number) => string;
    tournamentRegister: (id: string | number) => string;
    tournamentParticipants: (id: string | number) => string;
    tournamentChat: (id: string | number) => string;

    // Matches
    matches: string;
    matchStats: string;
    matchStreak: string;
    matchOpponents: string;
    matchAvailablePlayers: string;

    // Match Requests
    matchRequests: string;
    matchRequestsSent: string;
    matchRequestsReceived: string;
    matchRequestDetail: (id: string | number) => string;

    // Shop
    shop: string;
    shopAccessories: string;
    shopShops: string;
    shopPurchases: string;

    // Community
    communityFeed: string;
    communityPost: string;
    communityComments: (postId: string | number) => string;
    communityLike: (postId: string | number) => string;
    communityFollow: (userId: string | number) => string;
    communitySuggested: string;

    // Transactions
    transactions: string;
    sendPayment: string;
    transactionUsers: string;

    // Fallback
    (endpoint: string): string;
};

const apis = ((endpoint: string) => `${baseUrl}${endpoint}`) as ApiEndpoints;

// Auth
apis.login = apis('/auth/login');
apis.signup = apis('/auth/register');
apis.getUser = apis('/auth/user');
apis.getProfile = apis('/auth/profile');
apis.updateProfile = apis('/auth/profile');
apis.profileImage = apis('/auth/profile/image');
apis.users = apis('/auth/users');
apis.forgotPassword = apis('/auth/forgot-password');
apis.resetPassword = apis('/auth/reset-password');
apis.googleLogin = apis('/auth/google');
apis.phoneOtp = apis('/auth/phone/request-otp');
apis.verifyOtp = apis('/auth/phone/verify-otp');

// Games
apis.games = apis('/game');

// Tournaments
apis.tournaments = apis('/tournament');
apis.tournamentDetail = (id) => `${baseUrl}/tournament/${id}`;
apis.tournamentRegister = (id) => `${baseUrl}/tournament/${id}/register`;
apis.tournamentParticipants = (id) => `${baseUrl}/tournament/${id}/participants`;
apis.tournamentChat = (id) => `${baseUrl}/tournament/${id}/chat`;

// Matches
apis.matches = apis('/match');
apis.matchStats = apis('/match/stats');
apis.matchStreak = apis('/match/streak');
apis.matchOpponents = apis('/match/opponents');
apis.matchAvailablePlayers = apis('/match/available');

// Match Requests
apis.matchRequests = apis('/match/requests');
apis.matchRequestsSent = apis('/match/requests/sent');
apis.matchRequestsReceived = apis('/match/requests/received');
apis.matchRequestDetail = (id) => `${baseUrl}/match/requests/${id}`;

// Shop
apis.shop = apis('/shop');
apis.shopAccessories = apis('/shop');
apis.shopShops = apis('/shop/shops');
apis.shopPurchases = apis('/shop/purchases');

// Community
apis.communityFeed = apis('/community/feed');
apis.communityPost = apis('/community/post');
apis.communityComments = (postId) => `${baseUrl}/community/comments/${postId}`;
apis.communityLike = (postId) => `${baseUrl}/community/like/${postId}`;
apis.communityFollow = (userId) => `${baseUrl}/community/follow/${userId}`;
apis.communitySuggested = apis('/community/suggested');

// Transactions
apis.transactions = apis('/transaction');
apis.sendPayment = apis('/transaction/send');
apis.transactionUsers = apis('/transaction/users');

export default apis;
