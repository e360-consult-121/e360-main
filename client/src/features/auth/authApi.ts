import { baseApi } from '../../app/api';
import { clearAuth, setAuth } from './authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth({token:data.accessToken,role:data.role})); 
        } catch {
          
        }
      },
    }),
    logout: build.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAuth());
        } catch {
         
        }
      },
    }),
    register: build.mutation({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        data: newUser,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data)); 
        } catch {
         
        }
      },
    }),
    fetchUser: build.query({
      query: () => ({
        url: '/auth/fetch-user',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data)); 
        } catch {
         
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation ,useFetchUserQuery } = authApi;
