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
---

# Shop Lounge, Invite Codes & Join-By-Code (Update)

## Overview

Three things changed after the instant-match flow shipped:

1. **You no longer need to create a match to get a code.** A player can generate an
   invite code and hand it out; anyone with the code joins straight in.
2. **Matches played in a shop are physically local.** The shop is shown on a map,
   the players in a match are all at that same shop, and the shop's open players
   and running matches are visible live.
3. **Two blocking bugs are fixed** (avatar column fault, tournament game picker).

## New Files

| File | Role |
|---|---|
| `screens/Matches/JoinMatchScreen.tsx` (+ `.styles.ts`) | Standalone "Join a match" screen — paste a code, no setup required |
| `components/map/TileMap.tsx` | OpenStreetMap raster-tile map with a centre pin (no native dep, no API key) |
| `components/map/tileMath.ts` | Web-Mercator tile maths (zoom ↔ span, tile grid, lat/lng → pixels) |
| `utils/maps.ts` | Deep links (`openInMaps`), distance/coordinate formatting, haversine |
| `utils/inviteCode.ts` | Code alphabet + generation, normalisation, `shareInviteCode` |
| `utils/apiErrors.ts` | Turns API/schema faults into human messages (`describeApiError`) |
| `screens/Matches/instantMatch/useShopLiveMatches.ts` | 8-second polling of a shop's live board, paused when backgrounded |
| `screens/Matches/instantMatch/components/InviteCodeCard.tsx` | Generate / share a code, or type one in to join |
| `screens/Matches/instantMatch/components/ShopLocationCard.tsx` | Shop on the map + DIRECTIONS, who is inside, live-match count |
| `screens/Matches/instantMatch/components/OpenPlayersBoard.tsx` | Players in this shop open to play, with an "I'm open" switch |
| `screens/Matches/instantMatch/components/ShopMatchesBoard.tsx` | Every match running in the shop, with JOIN on open ones |
| `screens/Matches/instantMatch/components/SelectedOpponents.tsx` | Confirmed opponents, with the same-shop note |
| `docs/BACKEND_UPDATE_PROMPT.md` | Backend work needed (see below) |

## Updated Files

- **`services/match.ts`** — `generateInviteCode`, `joinByInviteCode`, `setOpenToPlay`,
  `fetchOpenPlayers`, `fetchShopLiveMatches`, `fetchMatchShopDetail`, `fetchMatchById`,
  `fetchWallet`, a shops fallback chain, and new normalisers (`toShopPlayer`,
  `toShopMatchSummary`, `toShop` with coordinates).
- **`api.ts`** — `/match/invite-code`, `/match/presence`, `/match/open-players`,
  `/match/shops/{id}/live`, `/match/shops/{id}`, `/match/{id}`, `/match/join`.
- **`types/index.ts`** — `Shop` (latitude/longitude/city/phone/playerCount/hasLiveMatches/distanceKm),
  `ShopPlayer`, `ShopMatchSummary`, `InviteCode`, `WalletInfo`, `MatchLocation`.
- **`screens/Matches/InstantMatchScreen.tsx`** — adds the shop map, open-players board
  and live shop-matches board between the location picker and match setup.
- **`screens/Home/UserHome.tsx`** (+ styles) — new **JOIN A MATCH** entry card.
- **`screens/Dashboard/UserDashboard.tsx`** — registers the `JoinMatch` screen.
- **`screens/Tournaments/CreateTournament.tsx`** — the game picker now carries a real
  `gameId` (the previous shape made Create Tournament silently send no game).

## Flows

### Get a code without creating a match
Instant Match → **INVITE & OPPONENTS** → **GENERATE CODE** → share it. If
`POST /match/invite-code` is not deployed, a code is generated on-device and
marked as offline; that code is then bound to the match when it is created.

### Join without creating a match
Home → **JOIN A MATCH** → type the code → **JOIN**. Alternatively tap **JOIN** on any
open match in the shop's live board. When the match is in a shop, the client adopts
that shop so the board, presence list and summary agree.

### Same-shop rule
A shop match only involves players at that shop. The client refuses to join a match
from another shop, switches shop context when it joins one, and the server must
enforce the same rule (see the backend prompt, §4).

### Live shop activity
With a shop selected the screen shows, refreshed every 8 seconds:
- where the shop is on the map, with DIRECTIONS;
- who is in the shop and open to play (with an "I'm open to play" switch);
- every match running there, with live player names and JOIN.

Polling pauses when the app is backgrounded and keeps the last good list when a
request fails, so a dropped connection never blanks the board.

## Bugs Fixed

1. **`Invalid column name 'ProfileImageUrl'`** — creating any match failed with a 500
   from the API. The client accepts `AvatarUrl` / `ProfileImageUrl` / `ProfileImage`
   (`PROFILE_IMAGE_KEYS`) and reports the server fault clearly; the backend must add
   or alias the column (see `docs/BACKEND_UPDATE_PROMPT.md` §1).
2. **Create Tournament game not selecting** — the picker compared one identifier and
   stored another, so the selected game was never sent. It now keeps the whole game
   record: `id` for the UI, `gameId` for the API payload.

## Backend Work Required

See **`docs/BACKEND_UPDATE_PROMPT.md`** for the complete contract: the
`ProfileImageUrl` hotfix, `POST /match/invite-code`, `POST /match/presence`,
`GET /match/open-players`, `GET /match/shops/{id}/live`, `GET /match/shops/{id}`,
shop coordinates, the same-shop rule, error codes and a curl acceptance checklist.
