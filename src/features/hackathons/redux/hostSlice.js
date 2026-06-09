import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  totalSteps: 4,
  formData: {
    // Step 1: Basic Info
    title: "",
    shortDescription: "",
    description: "",
    mode: "Online",
    bannerUrl: "",

    // Step 2: Timeline
    registrationStart: null,
    registrationEnd: null,
    submissionStart: null,
    submissionEnd: null,
    judgingStart: null,
    judgingEnd: null,
    timezone: "Asia/Kolkata",
    maxParticipants: 500,

    // Step 3: Competition
    minTeamSize: 2,
    maxTeamSize: 4,
    prizePool: "",
    tracks: [],
    rules: [],
  },
  errors: {},
  isSubmitting: false,
  isSuccess: false,
  successMessage: null,
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
    setSuccess: (state, action) => {
      state.isSuccess = true;
      state.successMessage = action.payload;
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setStep,
  updateFormData,
  setErrors,
  setSubmitting,
  setSuccess,
  resetForm,
} = hostSlice.actions;

export default hostSlice.reducer;
