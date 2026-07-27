// src/features/auth/utils/authValidation.js

import { z } from "zod";

export const PLATFORM_ROLES = [
  { value: "PARTICIPANT", label: "Participant — Join & compete in hackathons" },
  { value: "HOST", label: "Organizer — Create & manage hackathons" },
  { value: "JUDGE", label: "Judge — Evaluate and score projects" },
  { value: "MENTOR", label: "Mentor — Guide teams and resolve blockers" },
];

export const registerSchema = z
  .object({

    email: z.string().email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),

    role: z.enum(["PARTICIPANT", "HOST", "JUDGE", "MENTOR"], {
      required_error: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const otpSchema = z.object({
  otpCode: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only digits"),
});
