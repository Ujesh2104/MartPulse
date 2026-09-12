/**
 * JWT Token Utilities for client-side validation, expiration detection, and storage management.
 */

export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return false;
  // Expired if expiration timestamp is in the past (with a 5 second grace buffer)
  return decoded.exp * 1000 <= Date.now() + 5000;
};

export const getTokenRemainingTimeMs = (token) => {
  if (!token) return 0;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return 0;
  const remaining = decoded.exp * 1000 - Date.now();
  return remaining > 0 ? remaining : 0;
};

export const getStoredValidToken = () => {
  try {
    const token = localStorage.getItem('martpulse_token');
    if (!token) return null;
    if (isTokenExpired(token)) {
      localStorage.removeItem('martpulse_token');
      localStorage.removeItem('martpulse_user');
      return null;
    }
    return token;
  } catch {
    return null;
  }
};

export const getStoredValidUser = () => {
  try {
    const token = getStoredValidToken();
    if (!token) return null;
    const userStr = localStorage.getItem('martpulse_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};
