import { createSlice } from '@reduxjs/toolkit';
import { User } from './authTypes';


interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
