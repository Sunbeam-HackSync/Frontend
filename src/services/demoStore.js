import { demoSeedState } from "../mock/demoData";

const DEMO_STATE_KEY = "hackforge_demo_state";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function mergeArraysById(existing = [], seed = []) {
  const existingIds = new Set(existing.map((item) => item.id));
  return [...existing, ...seed.filter((item) => !existingIds.has(item.id))];
}

function normalizeState(state) {
  const nextState = {
    ...clone(demoSeedState),
    ...state,
  };

  for (const key of Object.keys(demoSeedState)) {
    nextState[key] = mergeArraysById(nextState[key], demoSeedState[key]);
  }

  return nextState;
}

export function getDemoState() {
  const storedState = localStorage.getItem(DEMO_STATE_KEY);

  if (!storedState) {
    const seed = clone(demoSeedState);
    localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(seed));
    return seed;
  }

  const parsedState = normalizeState(JSON.parse(storedState));
  localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(parsedState));
  return parsedState;
}

export function saveDemoState(state) {
  localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
}

export function updateDemoState(updater) {
  const currentState = getDemoState();
  const nextState = updater(clone(currentState));
  saveDemoState(nextState);
  return nextState;
}

export function resetDemoState() {
  const seed = clone(demoSeedState);
  saveDemoState(seed);
  return seed;
}

export function findUser(state, userId) {
  return state.users.find((user) => user.id === userId);
}

export function getHackathonRole(state, hackathonId, userId) {
  const membership = state.hackathonMembers.find(
    (member) =>
      member.hackathonId === hackathonId &&
      member.userId === userId &&
      member.status !== "REMOVED",
  );

  return membership?.role || null;
}

export function getRegistration(state, hackathonId, userId) {
  return state.registrations.find(
    (registration) =>
      registration.hackathonId === hackathonId && registration.userId === userId,
  );
}

export function registerForHackathon(state, hackathonId, userId) {
  const existingRegistration = getRegistration(state, hackathonId, userId);

  if (existingRegistration) return state;

  state.registrations.unshift({
    id: createId("reg"),
    hackathonId,
    userId,
    status: "PENDING",
    reviewedBy: "",
    reviewReason: "",
    appliedAt: new Date().toISOString(),
    reviewedAt: "",
  });

  state.notifications.unshift({
    id: createId("noti"),
    userId,
    title: "Registration submitted",
    message: "Your application is pending organizer review.",
    type: "REGISTRATION",
    readAt: "",
    createdAt: new Date().toISOString(),
  });

  return state;
}

export function updateHackathonStatus(state, hackathonId, status, actorId, reason = "") {
  state.hackathons = state.hackathons.map((hackathon) =>
    hackathon.id === hackathonId
      ? {
          ...hackathon,
          status,
          reviewReason: reason,
        }
      : hackathon,
  );

  state.auditLogs.unshift({
    id: createId("audit"),
    actorId,
    action: `${status}_HACKATHON`,
    entityType: "hackathon",
    entityId: hackathonId,
    metadata: { reason },
    createdAt: new Date().toISOString(),
  });

  return state;
}

export function updateRegistrationStatus(
  state,
  registrationId,
  status,
  reviewedBy,
  reason = "",
) {
  const registration = state.registrations.find((item) => item.id === registrationId);
  if (!registration) return state;

  registration.status = status;
  registration.reviewedBy = reviewedBy;
  registration.reviewReason = reason;
  registration.reviewedAt = new Date().toISOString();

  if (status === "APPROVED") {
    const isAlreadyMember = state.hackathonMembers.some(
      (member) =>
        member.hackathonId === registration.hackathonId &&
        member.userId === registration.userId &&
        member.role === "PARTICIPANT",
    );

    if (!isAlreadyMember) {
      state.hackathonMembers.push({
        id: createId("member"),
        hackathonId: registration.hackathonId,
        userId: registration.userId,
        role: "PARTICIPANT",
        status: "ACTIVE",
      });
    }
  }

  return state;
}

export function createAnnouncement(state, hackathonId, createdBy, title, message) {
  state.announcements.unshift({
    id: createId("ann"),
    hackathonId,
    createdBy,
    title,
    message,
    createdAt: new Date().toISOString(),
  });

  return state;
}

export function createTeam(state, hackathonId, userId, name, description) {
  const existingTeamMember = state.teamMembers.find(
    (member) => member.hackathonId === hackathonId && member.userId === userId,
  );

  if (existingTeamMember) return state;

  const teamId = createId("team");

  state.teams.unshift({
    id: teamId,
    hackathonId,
    name,
    description,
    inviteCode: `${name.replace(/\s+/g, "-").slice(0, 8).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900,
    )}`,
    status: "OPEN",
    lookingFor: ["Frontend Developer", "Designer"],
  });

  state.teamMembers.push({
    id: createId("tm"),
    hackathonId,
    teamId,
    userId,
    role: "LEADER",
  });

  return state;
}

export function createSubmission(state, hackathonId, teamId, submission) {
  const existingSubmission = state.submissions.find((item) => item.teamId === teamId);

  if (existingSubmission) {
    Object.assign(existingSubmission, {
      ...submission,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
    });
    return state;
  }

  state.submissions.unshift({
    id: createId("sub"),
    teamId,
    hackathonId,
    ...submission,
    techStack: submission.techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    status: "SUBMITTED",
    submittedAt: new Date().toISOString(),
    finalizedAt: "",
  });

  return state;
}

export function createHelpTicket(state, hackathonId, teamId, title, description, priority) {
  state.helpTickets.unshift({
    id: createId("ticket"),
    hackathonId,
    teamId,
    mentorId: "",
    title,
    description,
    meetingUrl: "",
    priority,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    claimedAt: "",
    resolvedAt: "",
  });

  return state;
}

export function claimHelpTicket(state, ticketId, mentorId) {
  const ticket = state.helpTickets.find((item) => item.id === ticketId);
  if (!ticket) return state;

  ticket.mentorId = mentorId;
  ticket.status = "CLAIMED";
  ticket.claimedAt = new Date().toISOString();
  ticket.meetingUrl = `https://meet.google.com/hfg-${ticketId.slice(-6)}`;

  return state;
}

export function resolveHelpTicket(state, ticketId) {
  const ticket = state.helpTickets.find((item) => item.id === ticketId);
  if (!ticket) return state;

  ticket.status = "RESOLVED";
  ticket.resolvedAt = new Date().toISOString();

  return state;
}

export function saveScores(state, assignmentId, scores, conflict = false) {
  const assignment = state.judgeAssignments.find((item) => item.id === assignmentId);
  if (!assignment) return state;

  assignment.conflict = conflict;
  assignment.status = conflict ? "CONFLICT_FLAGGED" : "COMPLETED";
  assignment.completedAt = new Date().toISOString();

  for (const score of scores) {
    const existingScore = state.scores.find(
      (item) => item.assignmentId === assignmentId && item.rubricId === score.rubricId,
    );

    if (existingScore) {
      existingScore.scoreGiven = score.scoreGiven;
      existingScore.comment = score.comment;
    } else {
      state.scores.push({
        id: createId("score"),
        assignmentId,
        rubricId: score.rubricId,
        scoreGiven: score.scoreGiven,
        comment: score.comment,
      });
    }
  }

  return state;
}
