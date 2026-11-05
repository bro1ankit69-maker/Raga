import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// RTK Query: one place for every call to our backend.
// The JWT is read from the Redux store and sent on every request.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || ''}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    signup: builder.mutation({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/auth/me', method: 'PATCH', body }),
    }),
    searchMusic: builder.query({
      query: (q) => `/music/search?q=${encodeURIComponent(q)}`,
    }),
    getFavorites: builder.query({
      query: () => '/favorites',
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation({
      query: (song) => ({ url: '/favorites', method: 'POST', body: song }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation({
      query: (trackId) => ({ url: `/favorites/${encodeURIComponent(trackId)}`, method: 'DELETE' }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useUpdateProfileMutation,
  useSearchMusicQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = api;
