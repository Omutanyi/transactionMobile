import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from './utils/ToastService';

// A normalized API error so callers can rely on a consistent shape.
export class ApiError extends Error {
  status?: number;
  details?: any;
  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Extract a human-readable message from any fetch/API response shape.
const extractMessage = (data: any, fallback: string): string => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((e: any) => e?.message ?? e).join(', ');
  }
  return fallback;
};

export async function request(url: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('jwt');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (e: any) {
    // Network / connectivity failure — not a server response.
    const message = e?.message || 'Network error. Please check your connection.';
    throw new ApiError(message, 0);
  }

  let data: any = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response body; fall through with raw text.
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message = extractMessage(data, `Request failed (${response.status})`);
    throw new ApiError(message, response.status, data);
  }

  return data;
}

// Helper to fire toast for network errors when the caller doesn't catch.
export const requestWithErrorToast = async (url: string, options: RequestInit = {}) => {
  try {
    return await request(url, options);
  } catch (e: any) {
    if (e?.status === 0) {
      toast.error('Network error. Please check your connection.');
    }
    throw e;
  }
};

export default request;
