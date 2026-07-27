// src/features/auth/redux/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getCurrentAuth,
  fetchUserProfile,
  parsePlatformRoles,
  parseJwtPayload,
} from "../services/authService";

const initialState = {
  user: null,           // { email, username } — populated on login or app init
  platformRoles: [],    // e.g. ["PARTICIPANT", "ROLE_PARTICIPANT"]
  token: null,          // JWT access token (also stored in cookie for persistence)
  isAuthenticated: false,
  loading: false,
  isInitializing: true, // Prevents route flicker — stays true until first auth check completes
  error: null,
};

/**
 * Runs once on app mount (App.jsx).
 * If a token cookie exists, fetches the user profile to hydrate Redux state.
 * On failure (expired/invalid token), clears state so the user is treated as logged out.
 */
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    const auth = getCurrentAuth();
    if (!auth?.token) {
      return rejectWithValue("No token found.");
    }
    try {
      const profile = await fetchUserProfile(); // { username, roles }
      const jwt = parseJwtPayload(auth.token);  // { sub (email), userId, role, iat, exp }
      return {
        user: {
          email: jwt?.sub || profile.username, // JWT contains the email as 'sub'
          username: profile.username,
          userId: jwt?.userId,
        },
        platformRoles: parsePlatformRoles(profile),
        token: auth.token,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Session expired.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Called after a successful login or OTP verification
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.platformRoles = action.payload.platformRoles;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.platformRoles = [];
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.platformRoles = action.payload.platformRoles;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isInitializing = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        // Token was invalid or expired — treat as logged out
        state.user = null;
        state.platformRoles = [];
        state.token = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
      });
  },
});

export const { setLoading, setAuth, logout, setError } = authSlice.actions;

export default authSlice.reducer;
