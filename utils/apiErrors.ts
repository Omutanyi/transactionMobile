// utils/apiErrors.ts
// Turns raw server/network failures into something a player (or the person
// running the backend) can act on.

/** True when the server response is a raw database/schema fault. */
export const isSchemaError = (message: string): boolean =>
  /invalid column name|unknown column|no such column|invalid object name/i.test(message);

/** Pulls the offending column name out of a SQL schema error, if present. */
export const missingColumnName = (message: string): string | null => {
  const match =
    message.match(/invalid column name '([^']+)'/i) ??
    message.match(/unknown column '([^']+)'/i) ??
    message.match(/no such column:? ([A-Za-z0-9_.]+)/i);
  return match?.[1] ?? null;
};

const rawMessage = (error: unknown): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  const message = (error as { message?: unknown })?.message;
  return typeof message === 'string' ? message : '';
};

/**
 * Human-friendly description of an API failure.
 *
 * Schema faults are reported separately because the app cannot recover from
 * them: the server is querying a column its database does not have, so the
 * request never reaches business logic. Surfacing the column name makes the
 * fix obvious instead of silently looking like "nothing happened".
 */
export const describeApiError = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string => {
  const message = rawMessage(error).trim();
  if (!message) return fallback;

  if (/network request failed|failed to fetch|network error/i.test(message)) {
    return 'Network error — check your connection and try again.';
  }

  if (isSchemaError(message)) {
    const column = missingColumnName(message);
    return column
      ? `The match service rejected the request: its database has no "${column}" column. The API needs updating before matches can be saved.`
      : 'The match service rejected the request because its database schema is out of date. The API needs updating.';
  }

  if (/^\s*<!doctype|<\/?html/i.test(message)) {
    return 'The server returned a web page instead of data — the API route is probably missing.';
  }

  return message;
};

/**
 * Longest meaningful slice of an error, used for toast titles that must stay
 * on one line.
 */
export const shortApiError = (error: unknown, fallback: string): string => {
  const description = describeApiError(error, fallback);
  return description.length > 140 ? `${description.slice(0, 137)}…` : description;
};
