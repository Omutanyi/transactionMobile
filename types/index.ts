import { ImageSourcePropType } from 'react-native';

export interface Player {
  id: string;
  username: string;
  avatar?: ImageSourcePropType;
  rating?: number;
  gamesPlayed?: number;
  winRate?: number;
  isOnline?: boolean;
}

export interface Game {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  description?: string;
  maxPlayers?: number;
}

export interface MatchRequest {
  id: string;
  senderId: string;
  recipientIds: string[];
  gameId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  game: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
  scheduledAt?: Date;
}
