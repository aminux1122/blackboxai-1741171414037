import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  twoFactorEnabled: false,
  twoFactorVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    setTwoFactorEnabled: (state, action) => {
      state.twoFactorEnabled = action.payload;
    },
    setTwoFactorVerified: (state, action) => {
      state.twoFactorVerified = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.twoFactorEnabled = false;
      state.twoFactorVerified = false;
    },
  },
});

export const { 
  setCredentials, 
  setTwoFactorEnabled, 
  setTwoFactorVerified, 
  logout 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectTwoFactorEnabled = (state) => state.auth.twoFactorEnabled;
export const selectTwoFactorVerified = (state) => state.auth.twoFactorVerified;
