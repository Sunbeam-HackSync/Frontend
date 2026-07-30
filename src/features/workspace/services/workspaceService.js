// src/features/workspace/services/workspaceService.js

import api from "../../../services/api";

// ─── Public / Discovery ────────────────────────────────────────────────────────

/** Fetch the public hackathon discovery feed (paginated). */
export async function getDiscoveryFeed(page = 0, size = 10) {
  try {
    const response = await api.get("/participants/hackathons", { params: { page, size } });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch hackathons.", { cause: error });
  }
}

/** Get public details of a hackathon by ID (participant view). */
export async function getParticipantHackathonById(id) {
  try {
    const response = await api.get(`/participants/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch hackathon.", { cause: error });
  }
}

// ─── Team ─────────────────────────────────────────────────────────────────────

/** Create a new team for a hackathon. */
export async function createTeam(data) {
  try {
    const response = await api.post("/participants/createTeam", data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create team.", { cause: error });
  }
}

/** Join an existing team by team ID. */
export async function joinTeam(id, data) {
  try {
    const response = await api.post(`/participants/teams/${id}/join`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to join team.", { cause: error });
  }
}

/** Get all teams for a hackathon (looking for members). */
export async function getTeams(hackathonId) {
  try {
    const response = await api.get(`/participants/hackathons/${hackathonId}/teams`);
    return response.data.data;
  } catch (error) {
    console.warn("getTeams: endpoint not available", error.response?.status);
    return [];
  }
}

/** Get the current user's team for a hackathon. */
export async function getMyTeam(hackathonId) {
  try {
    const response = await api.get(`/participants/hackathons/${hackathonId}/teams/me`);
    return response.data.data;
  } catch (error) {
    console.warn("getMyTeam: endpoint not available", error.response?.status);
    return null;
  }
}

// ─── Submissions & Help ────────────────────────────────────────────────────────

/** Submit or update a project submission. */
export async function submitProject(data) {
  try {
    const response = await api.post("/participants/submitProject", data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to submit project.", { cause: error });
  }
}

/** Get the current user's submission for a hackathon. */
export async function getMySubmission(hackathonId) {
  try {
    const response = await api.get(`/participants/hackathons/${hackathonId}/submission/me`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch submission.", { cause: error });
  }
}

/** Create a help ticket (participant requests mentor help). */
export async function createHelpTicket(data) {
  try {
    const response = await api.post("/participants/helpTickets", data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create help ticket.", { cause: error });
  }
}
