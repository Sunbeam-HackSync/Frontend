// src/features/admin/services/adminService.js

import api from "../../../services/api";

/**
 * Fetch platform-level metrics.
 * Response: { totalActiveHackathons, totalRegisteredUsers, totalSubmissions }
 */
export async function getAdminMetrics() {
  try {
    const response = await api.get("/admin/metrics");
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch platform metrics.");
  }
}

/**
 * Fetch all hackathons pending admin review (status: DRAFT).
 * Returns array of full hackathon detail objects.
 */
export async function getPendingHackathons() {
  try {
    const response = await api.get("/admin/hackathons/pending");
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch pending hackathons.");
  }
}

/** Approve a hackathon — changes status to APPROVED. */
export async function approveHackathon(id) {
  try {
    const response = await api.put(`/admin/hackathons/${id}/approve`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to approve hackathon.");
  }
}

/** Reject a hackathon — changes status to REJECTED. */
export async function rejectHackathon(id) {
  try {
    const response = await api.put(`/admin/hackathons/${id}/reject`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to reject hackathon.");
  }
}

/** Ban a user by their email. */
export async function banUser(email) {
  try {
    const response = await api.put(`/admin/users/${email}/ban`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to ban user.");
  }
}

/** Unban a user by their email. */
export async function unbanUser(email) {
  try {
    const response = await api.put(`/admin/users/${email}/unban`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to unban user.");
  }
}
