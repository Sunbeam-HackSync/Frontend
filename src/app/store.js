// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/redux/authSlice';
import hostReducer from '../features/hackathons/redux/hostSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    host: hostReducer,
  },
});
