# React Native Expo Transactions App

This is a mobile app built with React Native, Expo, and TypeScript. It features authentication, transaction dashboard, and payment sending functionality.

## Features
- Signup & Login screens (JWT stored with AsyncStorage)
- Dashboard with transaction list and role-based notifications
- Send Payment screen (choose recipient, amount, currency)
- Redux for user state
- API abstraction and global request handler
- Vector icons for modern UI
- Splash screen

## Setup Instructions

### Prerequisites
- Node.js (v20.17.0 or newer recommended)
- npm (v11.3.0 or newer recommended)
- Expo CLI (`npm install -g expo-cli`)

### 1. Clone the repository
```
git clone <your-repo-url>
cd frontend
```

### 2. Install dependencies
```
npm install
```

### 3. Start the Expo development server
```
npm start
```
Or, using Expo CLI:
```
expo start
```

### 4. Run on your device
- Scan the QR code with the Expo Go app (iOS/Android)
- Or run on an emulator: `npm run android` or `npm run ios`

### 5. Environment Variables
- Create a `.env.local` file if you need to override API URLs or secrets.

### 6. Project Structure
- `screens/` — All app screens (Dashboard, Login, Signup, SendPayment, Splash)
- `api.ts` — API endpoints
- `requests.ts` — Global API request handler
- `store.ts` — Redux store and user slice
- `assets/` — App icons and images

### 7. Notes
- Make sure your API server is running and the base URL in `api.ts` is correct.
- The app uses `@expo/vector-icons` for UI icons.

---

Feel free to customize and extend the app for your needs!
