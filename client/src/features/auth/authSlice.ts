import { createSlice } from "@reduxjs/toolkit";
import { User } from "./authTypes";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.loading = action.payload.loading || false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
