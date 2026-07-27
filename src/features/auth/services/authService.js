// src/features/auth/services/authService.js

import api from "../../../services/api";
import Cookies from "js-cookie";

// ─── Token Utilities ──────────────────────────────────────────────────────────

function saveToken(token) {
  Cookies.set("token", token, { expires: 7, sameSite: "strict" });
}

export function clearToken() {
  Cookies.remove("token");
}

/** Returns { token } if a token cookie exists, otherwise null. */
export function getCurrentAuth() {
  const token = Cookies.get("token");
  return token ? { token } : null;
}

/**
 * Decode the JWT payload client-side WITHOUT signature verification.
 * Use only for reading claims like email (sub), userId, role — never for security checks.
 * Security is enforced server-side on every protected request.
 */
export function parseJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
    // Decoded shape: { role, userId, sub (email), iat, exp }
  } catch {
    return null;
  }
}

/**
 * Normalize backend role format { authority: "ROLE_X" } into a flat array.
 * Produces both "ROLE_PARTICIPANT" and "PARTICIPANT" so any existing guard works.
 */
export function parsePlatformRoles(profile) {
  if (!profile) return [];
  const raw = profile.roles || (profile.role ? [profile.role] : []);
  if (!Array.isArray(raw)) return [];

  const result = new Set();
  raw.forEach((item) => {
    const str = typeof item === "string" ? item : (item?.authority || "");
    if (!str) return;
    result.add(str.toUpperCase());                       // e.g. "ROLE_PARTICIPANT"
    result.add(str.replace(/^ROLE_/i, "").toUpperCase()); // e.g. "PARTICIPANT"
  });
  return Array.from(result);
}

// ─── Auth API Calls ───────────────────────────────────────────────────────────

export async function registerUser({ email, password, role }) {
  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      role: role || "PARTICIPANT",
    });
    return response.data.data; // { id, email, role, ... }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed.");
  }
}

export async function verifyOtp(email, otpCode) {
  try {
    const response = await api.post("/auth/verify", { email, otpCode });
    const token = response.data?.data?.token;
    if (token) saveToken(token);
    return response.data.data; // { token, expiresIn }
  } catch (error) {
    throw new Error(error.response?.data?.message || "OTP verification failed.");
  }
}

export async function loginUser(email, password) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const token = response.data?.data?.token;
    if (token) saveToken(token);
    return response.data.data; // { token, expiresIn }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid email or password.");
  }
}

/** Returns { username, roles } from the backend. */
export async function fetchUserProfile() {
  try {
    const response = await api.get("/api/profiles/me");
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile.");
  }
}

export async function resendOtp(email) {
  try {
    await api.post("/auth/resend", { email });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to resend OTP.");
  }
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    // Still clear local state even if server call fails
    console.error("Logout error:", error);
  } finally {
    clearToken();
  }
}
