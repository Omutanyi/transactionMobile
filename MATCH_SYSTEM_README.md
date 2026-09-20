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

---

# Instant Match / Wager System (Update)

## Overview
A new **"Start Instant Match"** flow lets physically co-located players at a game shop ("gaming lounge") start a match **immediately**, with optional **cash wagers** secured by a **chalkman** (shop attendant). It supports **1v1** and **Party** (multi-player) matches, **Best-of series** rules, **stake/escrow** management, **phone notifications**, and **rematches**.

## New Files
- **`screens/Matches/InstantMatchScreen.tsx`** — 4-step instant match setup (game → match setup → stake → opponents)
- **`screens/Matches/InstantMatchScreen.styles.ts`** — styles
- **`services/match.ts`** — match/escrow/stake API service (normalizes PascalCase)
- **`docs/INSTANT_MATCH_PROMPT.md`** — reusable AI implementation prompt

## Updated Files
- **`types/index.ts`** — added `MatchMode`, `SeriesFormat`, `StakeMethod`, `StakeConfig`, `SeriesConfig`, `EscrowRecord`, `InstantMatch`, `InstantMatchDraft`, `ChalkmanOperation`
- **`api.ts`** — added endpoints: `/match/instant`, `/match/stake`, `/match/escrow`, `/match/{id}/rematch`, `/match/{id}/series`, `/match/{id}/notify`, `/match/{id}/escrow`, `/match/{id}/escrow/release`, `/match/{id}/escrow/refund`, `/match/chalkmen`, `/match/nearby`
- **`screens/Home/UserHome.tsx`** — "PLAY MATCH" card rebranded to **"INSTANT MATCH"** → navigates to `InstantMatch`
- **`screens/Dashboard/UserDashboard.tsx`** — registered `InstantMatch` screen in the nav stack
- **`tsconfig.json`** — explicitly set `"jsx": "react-jsx"` (inherited from Expo base)

## Scenarios Covered
1. **1v1 with a friend** — repeatable (rematch), phone notifications, stake paid instantly **or** held by chalkman until settled, Best-of-1/3/5 rules.
2. **Group of friends** — 2-player-only games restrict to 1v1; multi-player games (Pool, FPS, Battle Royale) support **Party** mode with a player-count stepper up to the game's max.

## Instant Match Flow
1. **Select Game** — horizontal carousel with a **max-players badge** (`2P`, `4P`, `8P`…).
2. **Match Setup** — `1v1 Duel` / `Party` (Party disabled for 2-player games) + player-count stepper + series format (`BO1`/`BO3`/`BO5`).
3. **Stake & Wager** — `Instant Pay` or `Chalkman Escrow`, amount input with quick chips, chalkman picker when escrow.
4. **Opponents** — invite code + "In this shop" nearby players list, selected-opponent chips.

## Backend API Contract
See the detailed contract in **`docs/INSTANT_MATCH_PROMPT.md` §4** and the frontend service in **`services/match.ts`**. Key endpoints:
- `POST /match/instant` — create instant match
- `POST /match/stake` — secure stake
- `POST /match/{id}/escrow` / `/release` / `/refund` — chalkman escrow lifecycle
- `PUT /match/{id}/series` — update series score
- `POST /match/{id}/notify` — send phone notifications
- `POST /match/{id}/rematch` — create a rematch
- `GET /match/chalkmen`, `GET /match/nearby` — chalkmen & in-shop players

---

# Tournament System (Update)

## Overview
The tournament section now supports **online** and **in-shop (local)** tournaments, **free / instant / chalkman-escrow** entry, and series play. A group of friends at a game shop can spin up a tournament and have the **chalkman** hold the entry pot until it is settled.

## New Files
- **`services/tournament.ts`** — tournament API service (create/fetch/register/stake/escrow/start/bracket/shops/chalkmen)
- **`docs/TOURNAMENT_BACKEND_PROMPT.md`** — the backend implementation prompt for the tournament API

## Updated Files
- **`types/index.ts`** — added `TournamentFormat`, `TournamentLocation`, `TournamentStatus`, `TournamentEntryMethod`, `TournamentStake`, `Shop`, `BracketMatch`, `Tournament`, `TournamentDraft`
- **`api.ts`** — added: `/tournament/{id}/stake`, `/tournament/{id}/escrow` (+ `/release`/`/refund`), `/tournament/{id}/start`, `/tournament/{id}/bracket`, `/tournament/shops`, `/tournament/{id}/chalkmen`
- **`screens/Tournaments/CreateTournament.tsx`** — added **HOSTING LOCATION** (Online / In-Shop), **ENTRY / WAGER** method (Free / Instant Pay / Chalkman Escrow), entry amount input, **shop picker** (when in-shop), and **chalkman picker** (when escrow)
- **`screens/Tournaments/CreateTournament.styles.ts`** — styles for the entry method, escrow card, and shop picker

## Create Tournament Flow
1. **Select Game** (grid)
2. **Settings** — name, description, tournament type (single/double elimination, round robin), **hosting location** (online vs in-shop)
3. **Entry / Wager** — `Free` / `Instant Pay` / `Chalkman Escrow`; entry amount; shop picker (in-shop); chalkman picker (escrow)
4. Prize pool, max participants, start date/time → **Create Tournament**

## Backend Contract
See **`docs/TOURNAMENT_BACKEND_PROMPT.md`** for the full REST contract, data models, validation rules, bracket generation, and payout logic.
</content>
