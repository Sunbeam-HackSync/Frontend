// src/features/participant/services/participantService.js

import api from "../../../services/api";

// ─── Discovery (Public) ────────────────────────────────────────────────────────

/** Fetch the public hackathon discovery feed (paginated). */
export async function getDiscoveryFeed(page = 0, size = 10) {
    try {
        const response = await api.get("/participants/hackathons", { params: { page, size } });
        return response.data.data; // Page object: { content, totalPages, totalElements, ... }
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch hackathons.");
    }
}

/** Get public details of any hackathon by ID. */
export async function getHackathonById(id) {
    try {
        const response = await api.get(`/participants/${id}`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch hackathon.");
    }
}

// ─── My Hackathons ─────────────────────────────────────────────────────────────

/** Fetch all hackathons the current user is registered in. */
export async function getMyHackathons() {
    try {
        const response = await api.get("/participants/my-hackathons");
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch your hackathons.");
    }
}

/**
 * Fetch hackathon + team context for the current user.
 * Returns: { hackathonDetails, teamDetails: { teamId, teamName, participants[] } }
 */
export async function getMyHackathonDetails(hackathonId) {
    try {
        const response = await api.get(`/participants/hackathons/${hackathonId}/my-details`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch hackathon details.");
    }
}

// ─── Teams ─────────────────────────────────────────────────────────────────────

/** Create a new team (creator becomes leader). Registers user for the hackathon. */
export async function createTeam(data) {
    // data: { hackathonId, teamName, skillsNeeded, lookingForMembers }
    try {
        const response = await api.post("/participants/createTeam", data);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create team.");
    }
}

/** Add a member to the team by email (team leader only). */
export async function addMember(teamId, email) {
    try {
        const response = await api.post(`/participants/teams/${teamId}/join`, { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to add member.");
    }
}

/** Get full team details including participant list. */
export async function getTeamDetails(teamId) {
    try {
        const response = await api.get(`/participants/teams/${teamId}`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch team details.");
    }
}

/** Update team settings (leader only). */
export async function updateTeam(teamId, data) {
    // data: { isLookingForMembers, skillsNeeded }
    try {
        const response = await api.put(`/participants/teams/${teamId}`, data);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update team.");
    }
}

// ─── Help Tickets ──────────────────────────────────────────────────────────────

/** Create a help ticket for mentor assistance. */
export async function createHelpTicket(data) {
    // data: { teamId, issueTitle, issueDescription, techTags }
    try {
        const response = await api.post("/participants/helpTickets", data);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create help ticket.");
    }
}

/** Fetch all help tickets for a team in a hackathon. */
export async function getMyTickets(hackathonId, teamId) {
    try {
        const response = await api.get(`/participants/tickets/${hackathonId}/${teamId}`);
        return response.data.data;
    } catch (error) {
        console.warn("getMyTickets:", error.response?.status, error.response?.data?.message);
        return [];
    }
}

// ─── Submissions ───────────────────────────────────────────────────────────────

/** Submit or update team's project. */
export async function submitProject(data) {
    // data: { teamId, projectTitle, tagLine, description, githubRepoUrl, liveDemoUrl, youtubeUrl }
    try {
        const response = await api.post("/participants/submissions", data);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to submit project.");
    }
}

// ─── Profile ───────────────────────────────────────────────────────────────────

/** Fetch the current user's participant profile. Returns null if not created yet. */
export async function getProfile() {
    try {
        const response = await api.get("/participants/profile");
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw new Error(error.response?.data?.message || "Failed to fetch profile.");
    }
}

/** Create participant profile (first time). */
export async function createProfile(data) {
    try {
        const response = await api.post("/participants/profile", data);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create profile.");
    }
}

/** Update existing participant profile. */
export async function updateProfile(data) {
    try {
        const response = await api.put("/participants/profile", data);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update profile.");
    }
}

// ─── Results ───────────────────────────────────────────────────────────────────

/** Fetch this participant's personal result for a hackathon. */
export async function getHackathonResult(hackathonId) {
    try {
        const response = await api.get(`/participants/hackathon/${hackathonId}/result`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch result.");
    }
}

/** Fetch the public winner list for a completed hackathon. */
export async function getHackathonWinners(hackathonId) {
    try {
        const response = await api.get(`/participants/hackathon/${hackathonId}/winners`);
        // console.log(data.data);

        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch winners.");
    }
}
