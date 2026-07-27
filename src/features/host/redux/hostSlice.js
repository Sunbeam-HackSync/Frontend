// src/features/hackathons/redux/hostSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  totalSteps: 3, // Step 1: Basic Info, Step 2: Timeline, Step 3: Review
  formData: {
    // Step 1: Basic Info — matches backend HackathonRequestDTO exactly
    title: "",
    tagline: "",
    description: "",
    bannerImageUrl: "",
    profileImageUrl: "",

    // Step 2: Team & Timeline
    minTeamSize: 2,
    maxTeamSize: 5,
    registrationStart: "",
    registrationEnd: "",
    hackathonStart: "",
    hackathonEnd: "",
  },
  errors: {},
  isSubmitting: false,
};

const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setStep, updateFormData, setErrors, setSubmitting, resetForm } =
  hostSlice.actions;

export default hostSlice.reducer;
