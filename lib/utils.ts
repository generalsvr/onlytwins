import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Cookies from 'js-cookie';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Tokens {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
}

export function setReferralCookie() {
  // Ensure this runs only on the client side
  if (typeof window === 'undefined') return;

  // Get URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');

  // If ref exists and is not already in cookies, set it
  if (ref && !Cookies.get('referral_code')) {
    Cookies.set('referral_code', ref, { expires: 60 }); // Set cookie for 60 days
  }
}

// Function to get tokens from cookies
export const getTokens = (): Tokens => {
  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('refresh_token');
  const expiresIn = Cookies.get('expires_in');
  const refreshExpiresIn = Cookies.get('refresh_expires_in');

  return {
    accessToken: accessToken || undefined,
    refreshToken: refreshToken || undefined,
    expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined,
    refreshExpiresIn: refreshExpiresIn ? parseInt(refreshExpiresIn, 10) : undefined,
  };
};

// Function to set tokens in cookies
export const setTokens = (tokens: { accessToken: string; refreshToken: string; expiresIn: number; refreshExpiresIn: number }) => {
  Cookies.set('access_token', tokens.accessToken, {
    expires: new Date(Date.now() + tokens.expiresIn * 1000), // expiresIn in seconds
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
  Cookies.set('refresh_token', tokens.refreshToken, {
    expires: new Date(Date.now() + tokens.refreshExpiresIn * 1000), // refreshExpiresIn in seconds
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};

// Function to clear tokens
export const clearTokens = () => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const pad = (num: number): string => String(num).padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}
export function getCurrentTime(): string {
  const date = new Date();
  const pad = (num: number): string => String(num).padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}