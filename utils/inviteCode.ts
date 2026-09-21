// utils/inviteCode.ts
// Invite codes let a player join somebody else's match — or hand out a code for
// their own open match — without creating a match first.

import { Share, Platform } from 'react-native';

/** Length of a generated code. Matches the backend's 8-character codes. */
export const INVITE_CODE_LENGTH = 8;

/**
 * Ambiguous glyphs (I/O/0/1) are excluded so a code can be read aloud across a
 * noisy gaming lounge without mistakes.
 */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Strips anything a keypad can mistype and clamps to the code length. */
export const normalizeInviteCode = (value: string): string =>
  (value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, INVITE_CODE_LENGTH);

/** Shortest code the backend accepts (see the join endpoint). */
export const MIN_INVITE_CODE_LENGTH = 4;

export const isValidInviteCode = (value: string): boolean =>
  normalizeInviteCode(value).length >= MIN_INVITE_CODE_LENGTH;

/**
 * Creates a code on-device. Used when the backend cannot hand one out (for
 * example before `POST /match/invite-code` exists) so the player can still
 * share a code and be joined.
 */
export const generateLocalInviteCode = (length = INVITE_CODE_LENGTH): string => {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
};

interface ShareInviteOptions {
  code: string;
  gameName?: string;
  shopName?: string;
  /** Set when the invitation is for a match that already exists. */
  matchId?: string;
}

/** Human sentence describing what the code is for. */
const buildInviteMessage = ({ code, gameName, shopName }: ShareInviteOptions): string => {
  const parts = [`Join my ${gameName ? `${gameName} ` : ''}match on ProGamer!`];
  if (shopName) parts.push(`We are playing at ${shopName}.`);
  parts.push(`Invite code: ${code}`);
  parts.push('Open the app → Instant Match → paste the code to jump in.');
  return parts.join('\n');
};

/** Opens the OS share sheet so the code can be sent over any messenger. */
export const shareInviteCode = async (options: ShareInviteOptions): Promise<boolean> => {
  try {
    await Share.share({ message: buildInviteMessage(options) });
    return true;
  } catch {
    // The user dismissed the sheet or the platform refused it — not an error
    // worth interrupting the flow for.
    return false;
  }
};

/** True on platforms whose share sheet cannot open a native messenger (web). */
export const shareSheetUnavailable = Platform.OS === 'web';
