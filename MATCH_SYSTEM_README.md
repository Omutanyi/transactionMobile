# One-on-One Match System - Feature Update

## Overview
This update introduces a comprehensive one-on-one match system with game-specific matching, multiple player selection, and request management capabilities.

## New Features

### 1. Game Selection Screen (`GameSelectionScreen.tsx`)
- **Purpose**: Allow users to select which game they want to play
- **Features**:
  - Display available games with icons and descriptions
  - Show maximum players allowed per game
  - Navigate to player selection for the chosen game
  - Quick access to sent requests

### 2. Enhanced One-on-One Match Screen (`OneOnOneMatchScreen.tsx`)
- **Purpose**: Find and challenge players for a specific game
- **Features**:
  - **Multiple Player Selection**: Users can select multiple players (up to game's max limit)
  - **Game-Specific UI**: Shows selected game info in header
  - **Real-time Player Search**: Search through available players
  - **Player Status**: Shows online/offline status and ratings
  - **Selection Summary**: Visual display of selected players
  - **Smart Challenge Button**: Adapts text based on selection count

### 3. Sent Requests Management (`SentRequestsScreen.tsx`)
- **Purpose**: View and manage sent match requests
- **Features**:
  - **Request Status Tracking**: Pending, accepted, declined, cancelled
  - **Visual Status Indicators**: Color-coded status with icons
  - **Request Details**: Show game, challenged players, and timestamps
  - **Cancel Functionality**: Cancel pending requests
  - **Pull-to-Refresh**: Update request status

### 4. Matches Stack Navigator (`MatchesStack.tsx`)
- **Purpose**: Organize match-related screens in a dedicated navigation stack
- **Structure**:
  ```
  GameSelection (entry point)
  ├── OneOnOneMatch (with game parameter)
  └── SentRequests
  ```

## Updated Type Definitions

### New Types Added to `types/index.ts`:

```typescript
// Game representation
interface Game {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  description?: string;
  maxPlayers?: number;
}

// Match request tracking
interface MatchRequest {
  id: string;
  senderId: string;
  recipientIds: string[]; // Support multiple recipients
  gameId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
}
```

## Integration

### How to Access the New Match System:

1. **From UserMatches Screen**: 
   - A floating action button (+) in the bottom right
   - Tapping opens the game selection screen

2. **Navigation Flow**:
   ```
   UserMatches → GameSelection → OneOnOneMatch → SentRequests
   ```

3. **Stack Navigation Integration**:
   - The new MatchesStack is integrated as a nested navigator
   - Maintains proper navigation hierarchy

## Key Improvements

### 1. Multiple Player Selection
- Users can challenge multiple players simultaneously
- Respects game-specific player limits
- Visual feedback for selection state
- Clear selection summary

### 2. Game-Specific Matching
- Each game can have different rules (max players, etc.)
- Game context is preserved throughout the flow
- Game-specific player filtering (can be implemented)

### 3. Request Management
- Comprehensive tracking of sent challenges
- Status updates and visual indicators
- Ability to cancel pending requests
- Time-based request tracking

### 4. Enhanced UI/UX
- Modern, intuitive design
- Clear visual hierarchy
- Responsive interactions
- Consistent theming

## Usage Examples

### Challenging Players:
1. User taps the (+) button in matches
2. Selects a game (e.g., "Chess")
3. Searches and selects players (up to game limit)
4. Sends challenge to selected players
5. Can view request status in "Sent Requests"

### Managing Requests:
1. Navigate to "Sent Requests"
2. View all sent challenges with status
3. Cancel pending requests if needed
4. Pull to refresh for latest status

## Mock Data
The implementation includes comprehensive mock data for:
- Available games with metadata
- Player profiles with ratings and status
- Sent requests with various statuses
- Realistic timestamps and game scenarios

## Future Enhancements
- Real-time notifications for request updates
- Game-specific player filtering
- Tournament bracket creation
- Advanced matching algorithms
- Social features (following players)

This update provides a solid foundation for a competitive gaming platform with proper match organization and player engagement features.
