const baseUrl = 'http://192.168.100.6:3000';

type ApiEndpoints = {
    login: string;
    signup: string;
    getUser: string;
    transactions: string;
    send: string;
    users: string;
    (endpoint: string): string;
};

const apis = ((endpoint: string) => `${baseUrl}${endpoint}`) as ApiEndpoints;

apis.login = apis('/login');
apis.signup = apis('/signup');
apis.getUser = apis('/user');
apis.transactions = apis('/transaction/transactions');
apis.send = apis('/transaction/send');
apis.users = apis('/users');

export default apis;