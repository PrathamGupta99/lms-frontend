import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isNormalUser: boolean;
};

type AuthContextType = AuthState & {
  registerAdmin: (payload: { email: string; password: string; name: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<{ user: User; token: string }>;
  logout: () => void;
  initialize: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'lms_auth';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    isNormalUser: false,
  });

  const persist = useCallback((user: User, token: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    setState({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
      isNormalUser: user.role === 'user',
    });
  }, []);

  const registerAdmin = useCallback(async (payload: { email: string; password: string; name: string }) => {
    const data = await postJson<{ user: User; token: string }>(`${apiBase}/auth/register`, payload);
    persist(data.user, data.token);
  }, [persist]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const data = await postJson<{ user: User; token: string }>(`${apiBase}/auth/login`, payload);
    persist(data.user, data.token);
    return data;
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isNormalUser: false,
    });
  }, []);

  const initialize = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { user: User; token: string };
      if (parsed?.user && parsed?.token) {
        persist(parsed.user, parsed.token);
      }
    } catch {
      // ignore corrupted storage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [persist]);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      registerAdmin,
      login,
      logout,
      initialize,
    }),
    [state, registerAdmin, login, logout, initialize],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
