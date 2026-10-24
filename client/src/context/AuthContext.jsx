import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [ready, setReady] = useState(false);
  useEffect(() => { let active = true; api.me().then(({ user: current }) => active && setUser(current)).catch(() => {}).finally(() => active && setReady(true)); return () => { active = false; }; }, []);
  const value = useMemo(() => ({ user, ready,
    async signIn(credentials) { const result = await api.login(credentials); setUser(result.user); return result.user; },
    async signUp(details) { const result = await api.register(details); setUser(result.user); return result.user; },
    async signOut() { await api.logout(); setUser(null); }
  }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; }

