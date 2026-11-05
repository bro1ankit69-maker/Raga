import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api, useLoginMutation, useSignupMutation, useUpdateProfileMutation } from '../store/apiSlice.js';
import { setCredentials, setUser, clearCredentials } from '../store/authSlice.js';

const AuthContext = createContext(null);

function errorMessage(err, fallback) {
  if (err?.status === 'FETCH_ERROR') return 'Cannot reach the server. Is the API running?';
  return err?.data?.error || fallback;
}

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);
  const [loginMutation] = useLoginMutation();
  const [signupMutation] = useSignupMutation();
  const [updateProfile] = useUpdateProfileMutation();

  // On first load, check the stored JWT is still valid
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (token) {
        try {
          const res = await dispatch(api.endpoints.getMe.initiate(undefined, { forceRefetch: true })).unwrap();
          if (!cancelled) dispatch(setUser(res.user));
        } catch (err) {
          if (err?.status === 401 && !cancelled) dispatch(clearCredentials());
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    if (!email || !password) return { success: false, error: 'Email and password are required' };
    try {
      const res = await loginMutation({ email, password }).unwrap();
      dispatch(setCredentials(res));
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: errorMessage(err, 'Login failed') };
    }
  }, [dispatch, loginMutation]);

  const signup = useCallback(async (data) => {
    if (!data?.name || !data?.email || !data?.password) {
      return { success: false, error: 'Please fill in all fields' };
    }
    try {
      const res = await signupMutation({
        name: data.name, email: data.email, password: data.password,
        country: data.country || '', dob: data.dob || '',
      }).unwrap();
      dispatch(setCredentials(res));
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: errorMessage(err, 'Signup failed') };
    }
  }, [dispatch, signupMutation]);

  const logout = useCallback(() => {
    dispatch(clearCredentials());
    dispatch(api.util.resetApiState());
  }, [dispatch]);

  const updateUser = useCallback(async (updates) => {
    if (!user) return;
    dispatch(setUser({ ...user, ...updates })); // update UI immediately
    try {
      const res = await updateProfile(updates).unwrap();
      dispatch(setUser(res.user));
    } catch (err) {
      console.warn('Profile update failed:', err);
    }
  }, [dispatch, user, updateProfile]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
