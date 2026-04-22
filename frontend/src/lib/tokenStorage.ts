const TOKEN_KEY = 'ace_auth_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
