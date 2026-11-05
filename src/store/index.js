import { configureStore } from '@reduxjs/toolkit';
import authReducer, { persistAuth } from './authSlice.js';
import { api } from './apiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

// Keep the token/user in localStorage so a refresh keeps you logged in
store.subscribe(() => persistAuth(store.getState().auth));
