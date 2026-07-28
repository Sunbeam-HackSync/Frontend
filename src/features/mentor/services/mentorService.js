import api from "../../../services/api";

/**
 * Fetch all tickets assigned to or claimable by the mentor, optionally filtered by status.
 * @param {string} status - Ticket status (e.g., 'OPEN', 'CLAIMED', 'RESOLVED')
 */
export async function getTicketsByStatus(status = "OPEN") {
    const response = await api.get(`/mentor/tickets`, {
        params: { status }
    });
    return response.data?.data || response.data;
}

/**
 * Generate secure meeting links for a ticket.
 * @param {Object} request - Contains { ticketId: number }
 */
export async function generateMeetingLinks(request) {
    const response = await api.post(`/mentor/generate`, request);
    return response.data?.data || response.data;
}

/**
 * Claim an open ticket by a mentor.
 * @param {number} ticketId 
 */
export async function claimTicket(ticketId) {
    const response = await api.put(`/mentor/tickets/${ticketId}/claim`);
    return response.data?.data || response.data;
}

/**
 * Resolve a claimed ticket.
 * @param {number} ticketId 
 */
export async function resolveTicket(ticketId) {
    const response = await api.put(`/mentor/tickets/${ticketId}/resolve`);
    return response.data?.data || response.data;
}

/**
 * Update the invitation status for a mentor to a hackathon (e.g., ACCEPTED, DECLINED).
 * @param {number} hackathonId 
 * @param {string} status 
 */
export async function updateInvitationStatus(hackathonId, status) {
    const response = await api.put(`/mentor/invitations/${hackathonId}/status`, null, {
        params: { status }
    });
    return response.data?.data || response.data;
}

/**
 * Get all hackathons assigned to the logged-in mentor.
 */
export async function getMyAssignedHackathons() {
    const response = await api.get(`/mentor/hackathons`);
    return response.data?.data || response.data;
}

/**
 * Get public details of any hackathon by ID.
 * This re-uses the public participant endpoint.
 */
export async function getHackathonDetailsPublic(id) {
    const response = await api.get(`/participants/${id}`);
    return response.data?.data || response.data;
}

export async function getProfile() {
    const response = await api.get('/participants/profile')
    console.log(response.data.data);

    return response.data?.data || response.data;
}

export async function createProfile(profileData) {
    const response = await api.post('/participants/profile', profileData)
    return response.data?.data || response.data;
}

export async function updateProfile(profileData) {
    const response = await api.put('/participants/profile', profileData)
    return response.data?.data || response.data;
}
