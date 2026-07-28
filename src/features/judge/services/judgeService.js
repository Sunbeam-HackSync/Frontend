
import api from "../../../services/api";

/*
    Called when judge clicks on the accept or reject button in the JudgeDashboard page
*/
export async function updateInvitationStatus(hackathonId, status) {
    const response = await api.put(`/judge/invitations/${hackathonId}/status`, null, {
        params: { status }
    });
    return response.data?.data || response.data;
}
/*
    Called by the super judge to submit the winners to the host of the hackathon
 */
export async function submitWinners(hackathonId, winners) {
    const response = await api.post(`/judge/hackathon/${hackathonId}/submit-winners`, winners);
    return response.data?.data || response.data;
}
/*
    Called by the super judge to check if the winners have been submitted or not
*/
export async function checkWinnersSubmitted(hackathonId) {
    const response = await api.get(`/judge/hackathon/${hackathonId}/winners-submitted`);
    return response.data?.data;
}
/*
    Called when JudgeDashboard page is loaded into the screen using UseEffect:
*/
export async function getMyAssignedHackathons() {
    const response = await api.get("/judge/hackathons");
    return response.data?.data || response.data;
}
/*
    Called when judge submits the scores for a project
*/
export async function submitScores(scoreData) {
    const response = await api.post("/judge/project/submit-scores", scoreData);
    return response.data?.data || response.data;
}
/*
    Called when to get Evaluation Criteria of a hackathon
*/
export async function getEvaluationCriteria(hackathonId) {
    const response = await api.get(`/judge/hackathon/${hackathonId}/criteria`);
    // console.log(response.data.data);
    return response.data?.data || response.data;
}
/*
    Called when the hackthons end and judge visits the evaluation criteria page
*/
export async function getAssignedSubmissions(hackathonId) {
    const response = await api.get(`/judge/hackathon/${hackathonId}/assignments`);
    // console.log(response.data.data);
    return response.data?.data || response.data;
}
/*
    Called when super judge wants to see all the submissions of a hackathon
*/
export async function getAllSubmissionsForSuperJudge(hackathonId, search = "") {
    const response = await api.get(`/judge/hackathon/${hackathonId}/all-submissions`, {
        params: { search }
    });
    return response.data?.data || response.data;
}

/*
    Called when judge clicks on the hackathon name in the JudgeDashboard page to see the details of the hackathons
*/
export async function getHackathonById(hackathonId) {
    const response = await api.get(`/judge/hackathon/${hackathonId}`);
    return response.data?.data || response.data;
}

export async function getProfile() {
    const response = await api.get('/participants/profile')
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

