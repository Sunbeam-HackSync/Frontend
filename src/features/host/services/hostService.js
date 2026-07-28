// src/features/host/services/hostService.js

import api from "../../../services/api";

// ─── Hackathon CRUD ────────────────────────────────────────────────────────────

/** Create a new hackathon. Returns the created hackathon object. */
export async function createHackathon(formData) {
  try {
    const response = await api.post("/host/hackathon/create", formData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create hackathon.");
  }
}

/** Get all hackathons created by the authenticated host. */
export async function getHostHackathons() {
  try {
    const response = await api.get("/host/me");
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch your hackathons.");
  }
}

/** Get full details of all hackathons created by the authenticated host. */
export async function getHostHackathonDetails() {
  try {
    const response = await api.get("/host/me/hackathons/details");
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch your hackathons details.");
  }
}

/** Get full details of a specific hackathon (host view). */
export async function getHostHackathonById(id) {
  try {
    const response = await api.get(`/host/hackathon/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch hackathon details.");
  }
}

/** Update hackathon fields. Payload mirrors the create request. */
export async function updateHackathon(id, data) {
  try {
    const response = await api.put(`/host/hackathon/${id}`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update hackathon.");
  }
}

// ─── Team management ──────────────────────────────────────────────────────────

/** Invite a registered user as a judge by email. */
export async function inviteJudge(hackathonId, email) {
  try {
    const response = await api.post(`/host/hackathon/${hackathonId}/judges`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add judge.");
  }
}

/** Invite a registered user as a mentor by email. */
export async function inviteMentor(hackathonId, email) {
  try {
    const response = await api.post(`/host/hackathon/${hackathonId}/mentors`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add mentor.");
  }
}

// ─── Hackathon lifecycle ──────────────────────────────────────────────────────

/** Publish hackathon results (only valid when status is COMPLETED). */
export async function publishHackathonResults(id) {
  try {
    const response = await api.put(`/host/hackathon/${id}/publish`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to publish results.");
  }
}

// ─── Roster views ─────────────────────────────────────────────────────────────

/** Get all participants registered for a hackathon. */
export async function getHackathonParticipants(id) {
  try {
    const response = await api.get(`/host/hackathon/${id}/participants`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch participants.");
  }
}

/** Get all submissions for a hackathon (host view). */
export async function getHackathonSubmissions(id) {
  try {
    const response = await api.get(`/host/hackathon/${id}/submissions`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch submissions.");
  }
}

// ─── Evaluation Criteria ──────────────────────────────────────────────────────

/** Get evaluation criteria for a hackathon. */
export async function getEvaluationCriteria(hackathonId) {
  try {
    const response = await api.get(`/host/hackathon/${hackathonId}/criteria`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch evaluation criteria.");
  }
}

/** Create evaluation criteria for a hackathon. */
export async function createEvaluationCriteria(hackathonId, data) {
  try {
    const response = await api.post(`/host/hackathon/${hackathonId}/evaluation-criteria`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create evaluation criteria.");
  }
}

/** Update evaluation criteria for a hackathon. */
export async function updateEvaluationCriteria(hackathonId, criteriaId, data) {
  try {
    const response = await api.put(`/host/hackathon/${hackathonId}/evaluation-criteria/${criteriaId}`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update evaluation criteria.");
  }
}

// ─── Submission Management ─────────────────────────────────────────────────────

/** Disqualify a submission. */
export async function disqualifySubmission(hackathonId, submissionId) {
  try {
    const response = await api.put(`/host/hackathon/${hackathonId}/submissions/${submissionId}/disqualify`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to disqualify submission.");
  }
}

// ─── Judge Management ──────────────────────────────────────────────────────────

/** Assign a judge as Super Judge. */
export async function assignSuperJudge(hackathonId, judgeUserId) {
  try {
    const response = await api.put(`/host/hackathon/${hackathonId}/judges/${judgeUserId}/assign-super-judge`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to assign super judge.");
  }
}
