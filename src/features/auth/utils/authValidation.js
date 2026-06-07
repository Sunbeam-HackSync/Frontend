// src/features/auth/utils/authValidation.js

import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),

    email: z.email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
