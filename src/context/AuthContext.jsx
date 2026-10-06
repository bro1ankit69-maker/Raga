import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getData, saveData, KEYS } from '../utils/localStorage.js';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

function persistSession(session) {
  const data = session ? JSON.stringify(session) : null;
  if (data) {
    saveData(KEYS.CURRENT_USER, session);
    sessionStorage.setItem('ragaplay_session', data);
  } else {
    saveData(KEYS.CURRENT_USER, null);
    sessionStorage.removeItem('ragaplay_session');
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = getData(KEYS.CURRENT_USER);
    if (stored) return stored;
    const session = sessionStorage.getItem('ragaplay_session');
    return session ? JSON.parse(session) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getData(KEYS.CURRENT_USER);
    const session = sessionStorage.getItem('ragaplay_session');
    const savedUser = stored || (session ? JSON.parse(session) : null);
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    if (!email || !password) return { success: false, error: 'Email and password are required' };

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const session = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
        persistSession(session);
        setUser(session);
        return { success: true, user: session };
      }
    } catch (error) {
      console.warn('Supabase login failed, falling back to localStorage:', error.message);
    }

    const users = getData(KEYS.USERS) || [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    if (found.status === 'deactivated') return { success: false, error: 'Account deactivated' };
    const session = { id: found.id, name: found.name, email: found.email, role: found.role };
    persistSession(session);
    setUser(session);
    return { success: true, user: session };
  }, []);

  const signup = useCallback(async (data) => {
    if (!data?.name || !data?.email || !data?.password) {
      return { success: false, error: 'Please fill in all fields' };
    }

    try {
      const { data: inserted, error } = await supabase
        .from('users')
        .insert([
          {
            id: 'u' + Date.now(),
            name: data.name,
            email: data.email,
            password: data.password,
            country: data.country || '',
            dob: data.dob || '',
            role: 'user',
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const session = { id: inserted.id, name: inserted.name, email: inserted.email, role: inserted.role };
      persistSession(session);
      setUser(session);
      return { success: true, user: session };
    } catch (error) {
      console.warn('Supabase signup failed, falling back to localStorage:', error.message);
    }

    const users = getData(KEYS.USERS) || [];
    if (users.some((u) => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      ...data,
      id: 'u' + Date.now(),
      role: 'user',
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    saveData(KEYS.USERS, [...users, newUser]);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: 'user' };
    persistSession(session);
    setUser(session);
    return { success: true, user: session };
  }, []);

  const logout = useCallback(() => {
    persistSession(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    if (!user) return;
    const users = getData(KEYS.USERS) || [];
    const updated = users.map((u) => (u.id === user.id ? { ...u, ...updates } : u));
    saveData(KEYS.USERS, updated);
    const newSession = { ...user, ...updates };
    persistSession(newSession);
    setUser(newSession);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
