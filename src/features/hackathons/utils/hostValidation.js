import { z } from "zod";

// Individual field schemas
const basicInfoSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),

  shortDescription: z.string()
    .min(10, "Short description must be at least 10 characters")
    .max(160, "Short description must not exceed 160 characters"),

  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  mode: z.enum(["Online", "Hybrid", "In-Person"]),

  bannerUrl: z.string().url("Invalid banner URL").optional().or(z.literal("")),
});

const timelineSchema = z.object({
  registrationStart: z.date().refine(
    (date) => date > new Date(),
    "Start date must be in the future"
  ),
  registrationEnd: z.date(),
  submissionStart: z.date(),
  submissionEnd: z.date(),
  judgingStart: z.date(),
  judgingEnd: z.date(),
  timezone: z.string().min(1, "Timezone is required"),
  maxParticipants: z.number().min(10, "Minimum 10 participants").max(10000),
})
  .refine(
    (data) => data.registrationEnd > data.registrationStart,
    { message: "Registration end must be after start", path: ["registrationEnd"] }
  )
  .refine(
    (data) => data.submissionStart >= data.registrationEnd,
    { message: "Submission cannot start before registration ends", path: ["submissionStart"] }
  )
  .refine(
    (data) => data.judgingStart >= data.submissionEnd,
    { message: "Judging cannot start before submission ends", path: ["judgingStart"] }
  );

const competitionSchema = z.object({
  minTeamSize: z.number().min(1, "Minimum 1 member").max(20),
  maxTeamSize: z.number().min(1, "Minimum 1 member").max(20),
  prizePool: z.string().min(1, "Prize pool is required"),
  tracks: z.array(z.string().min(2, "Track name too short"))
    .min(1, "At least 1 track required"),
  rules: z.array(z.string().min(10, "Rule too short"))
    .min(1, "At least 1 rule required"),
})
  .refine(
    (data) => data.maxTeamSize >= data.minTeamSize,
    { message: "Max team size must be >= min team size", path: ["maxTeamSize"] }
  );

// Combined full schema
export const hostHackathonSchema = z.object({
  ...basicInfoSchema.shape,
  ...timelineSchema.shape,
  ...competitionSchema.shape,
});

export const basicInfoSchemaForStep = basicInfoSchema;
export const timelineSchemaForStep = timelineSchema;
export const competitionSchemaForStep = competitionSchema;
