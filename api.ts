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
    tournamentStake: (id: string | number) => string;
    tournamentEscrow: (id: string | number) => string;
    tournamentEscrowRelease: (id: string | number) => string;
    tournamentEscrowRefund: (id: string | number) => string;
    tournamentStart: (id: string | number) => string;
    tournamentBracket: (id: string | number) => string;
    tournamentShops: string;
    tournamentChalkmen: (id: string | number) => string;

    // Matches
    matches: string;
    matchStats: string;
    matchStreak: string;
    matchOpponents: string;
    matchAvailablePlayers: string;

    // Instant Match / Wager
    instantMatch: string;
    matchStake: string;
    matchEscrow: string;
    matchRematch: (id: string | number) => string;
    matchSeries: (id: string | number) => string;
    matchNotify: (id: string | number) => string;
    matchEscrowHold: (id: string | number) => string;
    matchEscrowRelease: (id: string | number) => string;
    matchEscrowRefund: (id: string | number) => string;
    matchChalkmen: string;
    matchNearbyPlayers: string;
    matchShops: string;
    matchWallet: string;
    matchJoin: (id: string | number) => string;
    matchJoinByCode: string;
    matchResult: (id: string | number) => string;
    matchCancel: (id: string | number) => string;
    /** Single match by id (used to preview a match before joining it). */
    matchDetail: (id: string | number) => string;
    /** Generate a shareable invite code the caller hands to other players. */
    matchInviteCode: string;
    /** Players in a shop who are open to play right now. */
    matchOpenPlayers: string;
    /** Ping the shop that the caller is (or is no longer) open to play. */
    matchPresence: string;
    /** Live board — every match currently running in one shop. */
    matchShopLive: (shopId: string | number) => string;
    /** One shop with its map coordinates and on-duty chalkman. */
    matchShopDetail: (shopId: string | number) => string;

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
    /** Single shop record (used for the map pin / counter details). */
    shopDetail: (id: string | number) => string;

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
apis.tournamentStake = (id) => `${baseUrl}/tournament/${id}/stake`;
apis.tournamentEscrow = (id) => `${baseUrl}/tournament/${id}/escrow`;
apis.tournamentEscrowRelease = (id) => `${baseUrl}/tournament/${id}/escrow/release`;
apis.tournamentEscrowRefund = (id) => `${baseUrl}/tournament/${id}/escrow/refund`;
apis.tournamentStart = (id) => `${baseUrl}/tournament/${id}/start`;
apis.tournamentBracket = (id) => `${baseUrl}/tournament/${id}/bracket`;
apis.tournamentShops = apis('/tournament/shops');
apis.tournamentChalkmen = (id) => `${baseUrl}/tournament/${id}/chalkmen`;

// Matches
apis.matches = apis('/match');
apis.matchStats = apis('/match/stats');
apis.matchStreak = apis('/match/streak');
apis.matchOpponents = apis('/match/opponents');
apis.matchAvailablePlayers = apis('/match/available');

// Instant Match / Wager
apis.instantMatch = apis('/match/instant');
apis.matchStake = apis('/match/stake');
apis.matchEscrow = apis('/match/escrow');
apis.matchRematch = (id) => `${baseUrl}/match/${id}/rematch`;
apis.matchSeries = (id) => `${baseUrl}/match/${id}/series`;
apis.matchNotify = (id) => `${baseUrl}/match/${id}/notify`;
apis.matchEscrowHold = (id) => `${baseUrl}/match/${id}/escrow`;
apis.matchEscrowRelease = (id) => `${baseUrl}/match/${id}/escrow/release`;
apis.matchEscrowRefund = (id) => `${baseUrl}/match/${id}/escrow/refund`;
apis.matchChalkmen = apis('/match/chalkmen');
apis.matchNearbyPlayers = apis('/match/nearby');
apis.matchShops = apis('/match/shops');
apis.matchWallet = apis('/match/wallet');
apis.matchJoin = (id) => `${baseUrl}/match/${id}/join`;
apis.matchJoinByCode = apis('/match/join');
apis.matchResult = (id) => `${baseUrl}/match/${id}/result`;
apis.matchCancel = (id) => `${baseUrl}/match/${id}/cancel`;
apis.matchDetail = (id) => `${baseUrl}/match/${id}`;
apis.matchInviteCode = apis('/match/invite-code');
apis.matchOpenPlayers = apis('/match/open-players');
apis.matchPresence = apis('/match/presence');
apis.matchShopLive = (shopId) => `${baseUrl}/match/shops/${shopId}/live`;
apis.matchShopDetail = (shopId) => `${baseUrl}/match/shops/${shopId}`;

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
apis.shopDetail = (id) => `${baseUrl}/shop/${id}`;

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
