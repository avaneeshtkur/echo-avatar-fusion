/** Shared localStorage keys for client-side auth (prototype only). */

export const USERS_KEY = 'echo_avatar_users';
export const AUTH_TOKEN_KEY = 'echo_avatar_auth_token';
export const CURRENT_USER_KEY = 'echo_avatar_current_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getAuthToken() && localStorage.getItem(CURRENT_USER_KEY));
}
