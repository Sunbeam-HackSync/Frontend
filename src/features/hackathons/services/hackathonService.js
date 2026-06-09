import {
  getDemoState,
  updateDemoState,
  createId,
} from "../../../services/demoStore";
import { hostHackathonSchema } from "../utils/hostValidation";

// Validate form data
export function validateHostForm(data) {
  try {
    hostHackathonSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    return { success: false, errors };
  }
}

// Generate slug from title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

// Create hackathon in demo store
export function createHackathon(formData, userId) {
  const state = getDemoState();

  const slug = generateSlug(formData.title);

  // Check if slug already exists
  if (state.hackathons.some((h) => h.slug === slug)) {
    throw new Error("A hackathon with a similar title already exists");
  }

  const newHackathon = {
    id: createId("hack"),
    organizerId: userId,
    title: formData.title,
    slug,
    shortDescription: formData.shortDescription,
    description: formData.description,
    bannerUrl: formData.bannerUrl || "",
    status: "PENDING_APPROVAL", // Default status
    mode: formData.mode,
    prizePool: formData.prizePool,
    minTeamSize: formData.minTeamSize,
    maxTeamSize: formData.maxTeamSize,
    registrationStart: formData.registrationStart.toISOString(),
    registrationEnd: formData.registrationEnd.toISOString(),
    submissionStart: formData.submissionStart.toISOString(),
    submissionEnd: formData.submissionEnd.toISOString(),
    judgingStart: formData.judgingStart.toISOString(),
    judgingEnd: formData.judgingEnd.toISOString(),
    timezone: formData.timezone,
    maxParticipants: formData.maxParticipants,
    rules: formData.rules,
    tracks: formData.tracks,
    reviewReason: "",
  };

  // Update state
  updateDemoState((currentState) => {
    // Add hackathon
    currentState.hackathons.unshift(newHackathon);

    // Add organizer as member
    currentState.hackathonMembers.push({
      id: createId("member"),
      hackathonId: newHackathon.id,
      userId,
      role: "ORGANIZER",
      status: "ACTIVE",
    });

    // Audit log
    currentState.auditLogs.unshift({
      id: createId("audit"),
      actorId: userId,
      action: "CREATED_HACKATHON",
      entityType: "hackathon",
      entityId: newHackathon.id,
      metadata: { title: newHackathon.title, slug },
      createdAt: new Date().toISOString(),
    });

    return currentState;
  });

  return newHackathon;
}
