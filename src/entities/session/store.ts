import { create } from 'zustand';

interface SessionState {
  token: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, rememberMe: boolean) => void;
  logout: () => void;
}

// ДОБАВЬ <SessionState> ВОТ СЮДА:
export const useSessionStore = create<SessionState>((set) => ({
  token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  isAuthenticated: !!(localStorage.getItem('token') || sessionStorage.getItem('token')),

  setSession: (token, rememberMe) => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
}));