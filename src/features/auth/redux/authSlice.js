// src/features/auth/redux/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

import { getCurrentAuth } from "../services/authService";

const existingAuth = getCurrentAuth();

const initialState = {
  user: existingAuth?.user || null,

  platformRoles: existingAuth?.platformRoles || [],

  token: existingAuth?.token || null,

  isAuthenticated: !!existingAuth,

  loading: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

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
});

export const { setLoading, setAuth, logout, setError } = authSlice.actions;

export default authSlice.reducer;
