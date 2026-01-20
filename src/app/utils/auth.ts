const AUTH_KEY = 'forcheck_auth';

export interface AuthState {
  isAuthenticated: boolean;
  email?: string;
  loginTime?: string;
}

export function loadAuthState(): AuthState {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
  return { isAuthenticated: false };
}

export function saveAuthState(state: AuthState): void {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
}

export function login(email: string): AuthState {
  const authState: AuthState = {
    isAuthenticated: true,
    email,
    loginTime: new Date().toISOString(),
  };
  saveAuthState(authState);
  return authState;
}

export function logout(): void {
  saveAuthState({ isAuthenticated: false });
}
