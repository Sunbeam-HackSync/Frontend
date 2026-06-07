export const seedUsers = [
  {
    id: "user-1",
    fullName: "Super Admin",
    email: "admin@hackforge.com",
    password: "admin123",
    avatarUrl: "",
    bio: "Platform owner responsible for approvals, safety, and analytics.",
    githubUrl: "https://github.com/hackforge-admin",
    linkedinUrl: "https://linkedin.com/in/hackforge-admin",
    portfolioUrl: "https://hackforge.dev",
    techStack: ["React", "Node.js", "PostgreSQL", "Cloud"],
  },
  {
    id: "user-2",
    fullName: "Rahul Sharma",
    email: "rahul@hackforge.com",
    password: "rahul123",
    avatarUrl: "",
    bio: "Organizer building developer programs for universities and startups.",
    githubUrl: "https://github.com/rahul-hackforge",
    linkedinUrl: "https://linkedin.com/in/rahul-sharma",
    portfolioUrl: "https://rahul.events",
    techStack: ["Product", "Community", "React", "Analytics"],
  },
  {
    id: "user-3",
    fullName: "Priya Verma",
    email: "priya@hackforge.com",
    password: "priya123",
    avatarUrl: "",
    bio: "Frontend engineer who loves AI products and clean user experiences.",
    githubUrl: "https://github.com/priya-builds",
    linkedinUrl: "https://linkedin.com/in/priya-verma",
    portfolioUrl: "https://priyaverma.dev",
    techStack: ["React", "TypeScript", "Figma", "Firebase"],
  },
  {
    id: "user-4",
    fullName: "Arjun Mehta",
    email: "judge@hackforge.com",
    password: "judge123",
    avatarUrl: "",
    bio: "Senior engineering leader evaluating technical depth and viability.",
    githubUrl: "https://github.com/arjun-evaluates",
    linkedinUrl: "https://linkedin.com/in/arjun-mehta",
    portfolioUrl: "https://arjunmehta.dev",
    techStack: ["Architecture", "AI", "Security", "Scale"],
  },
  {
    id: "user-5",
    fullName: "Neha Iyer",
    email: "mentor@hackforge.com",
    password: "mentor123",
    avatarUrl: "",
    bio: "Full stack mentor helping teams debug, scope, and ship quickly.",
    githubUrl: "https://github.com/neha-mentor",
    linkedinUrl: "https://linkedin.com/in/neha-iyer",
    portfolioUrl: "https://neha.dev",
    techStack: ["React", "Express", "MongoDB", "DevOps"],
  },
  {
    id: "user-6",
    fullName: "Aman Khan",
    email: "aman@hackforge.com",
    password: "aman123",
    avatarUrl: "",
    bio: "Backend developer focused on APIs and database performance.",
    githubUrl: "https://github.com/aman-api",
    linkedinUrl: "https://linkedin.com/in/aman-khan",
    portfolioUrl: "https://amankhan.dev",
    techStack: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
  },
];

export const seedPlatformRoles = [
  {
    userId: "user-1",
    role: "SUPER_ADMIN",
  },
];

export const seedHackathons = [
  {
    id: "hack-1",
    organizerId: "user-2",
    title: "AI Innovation Challenge",
    slug: "ai-innovation-challenge",
    shortDescription:
      "Build practical AI tools for education, healthcare, and public services.",
    description:
      "A 48-hour online hackathon for teams creating useful, ethical AI applications with strong product thinking and working demos.",
    bannerUrl: "",
    status: "LIVE",
    mode: "Online",
    prizePool: "Rs. 4,00,000",
    minTeamSize: 2,
    maxTeamSize: 4,
    registrationStart: "2026-06-01T09:00:00",
    registrationEnd: "2026-06-15T23:59:00",
    submissionStart: "2026-06-10T09:00:00",
    submissionEnd: "2026-06-18T23:59:00",
    judgingStart: "2026-06-19T09:00:00",
    judgingEnd: "2026-06-21T18:00:00",
    timezone: "Asia/Kolkata",
    maxParticipants: 800,
    rules: [
      "All work must be created during the hackathon window.",
      "Every team must submit a repository and demo video.",
      "Use of open-source libraries and public APIs is allowed with attribution.",
    ],
    tracks: ["AI for Learning", "AI for Health", "AI for Governance"],
  },
  {
    id: "hack-2",
    organizerId: "user-2",
    title: "Web3 Buildathon",
    slug: "web3-buildathon",
    shortDescription:
      "Prototype transparent, secure, and useful decentralized applications.",
    description:
      "A hybrid hackathon for builders working on wallets, identity, smart contracts, and community tooling.",
    bannerUrl: "",
    status: "APPROVED",
    mode: "Hybrid",
    prizePool: "Rs. 2,50,000",
    minTeamSize: 1,
    maxTeamSize: 5,
    registrationStart: "2026-06-20T09:00:00",
    registrationEnd: "2026-07-05T23:59:00",
    submissionStart: "2026-07-06T09:00:00",
    submissionEnd: "2026-07-09T23:59:00",
    judgingStart: "2026-07-10T09:00:00",
    judgingEnd: "2026-07-11T18:00:00",
    timezone: "Asia/Kolkata",
    maxParticipants: 500,
    rules: [
      "Smart contract source code must be public.",
      "Teams must include a security notes section in the submission.",
      "Demo links must remain accessible through judging.",
    ],
    tracks: ["DeFi", "Identity", "Creator Tools"],
  },
  {
    id: "hack-3",
    organizerId: "user-2",
    title: "Smart Campus Hack",
    slug: "smart-campus-hack",
    shortDescription:
      "Solve campus problems using web, mobile, IoT, and data-driven systems.",
    description:
      "A university-focused innovation sprint for attendance, placements, transport, energy, and student support workflows.",
    bannerUrl: "",
    status: "PENDING_APPROVAL",
    mode: "Online",
    prizePool: "Rs. 1,50,000",
    minTeamSize: 2,
    maxTeamSize: 4,
    registrationStart: "2026-08-01T09:00:00",
    registrationEnd: "2026-08-10T23:59:00",
    submissionStart: "2026-08-11T09:00:00",
    submissionEnd: "2026-08-13T23:59:00",
    judgingStart: "2026-08-14T09:00:00",
    judgingEnd: "2026-08-15T18:00:00",
    timezone: "Asia/Kolkata",
    maxParticipants: 300,
    reviewReason: "",
    rules: [
      "Solutions must target a real campus workflow.",
      "Teams must present a clickable prototype or working app.",
      "Submissions must include a short implementation roadmap.",
    ],
    tracks: ["Student Life", "Operations", "Placements"],
  },
];

export const seedHackathonMembers = [
  { id: "member-1", hackathonId: "hack-1", userId: "user-2", role: "ORGANIZER", status: "ACTIVE" },
  { id: "member-2", hackathonId: "hack-1", userId: "user-3", role: "PARTICIPANT", status: "ACTIVE" },
  { id: "member-3", hackathonId: "hack-1", userId: "user-4", role: "JUDGE", status: "ACTIVE" },
  { id: "member-4", hackathonId: "hack-1", userId: "user-5", role: "MENTOR", status: "ACTIVE" },
  { id: "member-5", hackathonId: "hack-1", userId: "user-6", role: "PARTICIPANT", status: "ACTIVE" },
  { id: "member-6", hackathonId: "hack-2", userId: "user-2", role: "ORGANIZER", status: "ACTIVE" },
  { id: "member-7", hackathonId: "hack-2", userId: "user-4", role: "JUDGE", status: "INVITED" },
];

export const seedRegistrations = [
  {
    id: "reg-1",
    hackathonId: "hack-1",
    userId: "user-3",
    status: "APPROVED",
    reviewedBy: "user-2",
    reviewReason: "Strong AI portfolio.",
    appliedAt: "2026-06-02T10:00:00",
    reviewedAt: "2026-06-02T13:00:00",
  },
  {
    id: "reg-2",
    hackathonId: "hack-1",
    userId: "user-6",
    status: "APPROVED",
    reviewedBy: "user-2",
    reviewReason: "Backend skillset balances the participant pool.",
    appliedAt: "2026-06-03T11:00:00",
    reviewedAt: "2026-06-03T14:00:00",
  },
  {
    id: "reg-3",
    hackathonId: "hack-1",
    userId: "user-5",
    status: "PENDING",
    reviewedBy: "",
    reviewReason: "",
    appliedAt: "2026-06-04T09:30:00",
    reviewedAt: "",
  },
];

export const seedTeams = [
  {
    id: "team-1",
    hackathonId: "hack-1",
    name: "Neural Ninjas",
    description: "Building a personalized AI study coach for diploma students.",
    inviteCode: "NN-AI-2026",
    status: "OPEN",
    lookingFor: ["ML Engineer", "UI Designer"],
  },
  {
    id: "team-2",
    hackathonId: "hack-1",
    name: "CareSync",
    description: "Creating a triage assistant for rural health centers.",
    inviteCode: "CARE-48",
    status: "LOCKED",
    lookingFor: ["Backend Developer"],
  },
];

export const seedTeamMembers = [
  { id: "tm-1", hackathonId: "hack-1", teamId: "team-1", userId: "user-3", role: "LEADER" },
  { id: "tm-2", hackathonId: "hack-1", teamId: "team-1", userId: "user-6", role: "MEMBER" },
];

export const seedTeamJoinRequests = [
  {
    id: "join-1",
    teamId: "team-1",
    userId: "user-5",
    message: "I can mentor UI direction and help with rapid prototyping.",
    status: "PENDING",
    createdAt: "2026-06-06T10:15:00",
  },
];

export const seedSubmissions = [
  {
    id: "sub-1",
    teamId: "team-1",
    hackathonId: "hack-1",
    title: "LearnMate AI",
    description:
      "An AI study assistant that creates revision plans, quizzes, and progress summaries from uploaded notes.",
    repositoryUrl: "https://github.com/priya-builds/learnmate-ai",
    demoVideoUrl: "https://youtu.be/demo-learnmate",
    presentationUrl: "https://docs.example.com/learnmate",
    techStack: ["React", "Node.js", "OpenAI API", "PostgreSQL"],
    status: "SUBMITTED",
    submittedAt: "2026-06-18T18:30:00",
    finalizedAt: "",
  },
];

export const seedHelpTickets = [
  {
    id: "ticket-1",
    hackathonId: "hack-1",
    teamId: "team-1",
    mentorId: "user-5",
    title: "Vector search response quality",
    description:
      "Our retrieval answers are relevant but too verbose. Need help tightening prompt and ranking.",
    meetingUrl: "https://meet.google.com/hfg-ai-help",
    priority: "HIGH",
    status: "CLAIMED",
    createdAt: "2026-06-12T14:20:00",
    claimedAt: "2026-06-12T14:35:00",
    resolvedAt: "",
  },
  {
    id: "ticket-2",
    hackathonId: "hack-1",
    teamId: "team-2",
    mentorId: "",
    title: "Deployment failing on environment variables",
    description:
      "Frontend builds locally, but hosted app cannot read API URL from environment config.",
    meetingUrl: "",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "2026-06-13T09:05:00",
    claimedAt: "",
    resolvedAt: "",
  },
];

export const seedJudgeAssignments = [
  {
    id: "assign-1",
    judgeId: "user-4",
    submissionId: "sub-1",
    assignedBy: "user-2",
    status: "IN_REVIEW",
    assignedAt: "2026-06-19T09:00:00",
    completedAt: "",
    conflict: false,
  },
];

export const seedRubrics = [
  { id: "rubric-1", hackathonId: "hack-1", title: "Technical Complexity", description: "Architecture, implementation depth, and correctness.", maxScore: 10, weightage: 35, displayOrder: 1 },
  { id: "rubric-2", hackathonId: "hack-1", title: "Design and UX", description: "Usability, clarity, accessibility, and polish.", maxScore: 10, weightage: 25, displayOrder: 2 },
  { id: "rubric-3", hackathonId: "hack-1", title: "Innovation", description: "Originality and strength of problem-solution fit.", maxScore: 10, weightage: 25, displayOrder: 3 },
  { id: "rubric-4", hackathonId: "hack-1", title: "Viability", description: "Practicality, scalability, and future roadmap.", maxScore: 10, weightage: 15, displayOrder: 4 },
];

export const seedScores = [
  { id: "score-1", assignmentId: "assign-1", rubricId: "rubric-1", scoreGiven: 8, comment: "Solid architecture with clear service boundaries." },
  { id: "score-2", assignmentId: "assign-1", rubricId: "rubric-2", scoreGiven: 7, comment: "Good flow, dashboard can be simplified." },
];

export const seedAnnouncements = [
  {
    id: "ann-1",
    hackathonId: "hack-1",
    createdBy: "user-2",
    title: "Submission window is open",
    message: "Teams can now submit repository, demo video, and presentation links.",
    createdAt: "2026-06-10T09:00:00",
  },
  {
    id: "ann-2",
    hackathonId: "hack-1",
    createdBy: "user-2",
    title: "Mentor room schedule",
    message: "Mentors are available from 10 AM to 8 PM. Raise help tickets from your workspace.",
    createdAt: "2026-06-11T10:00:00",
  },
];

export const seedNotifications = [
  {
    id: "noti-1",
    userId: "user-3",
    title: "Registration approved",
    message: "You are approved for AI Innovation Challenge.",
    type: "REGISTRATION",
    readAt: "",
    createdAt: "2026-06-02T13:01:00",
  },
];

export const seedAuditLogs = [
  {
    id: "audit-1",
    actorId: "user-1",
    action: "APPROVED_HACKATHON",
    entityType: "hackathon",
    entityId: "hack-1",
    metadata: { title: "AI Innovation Challenge" },
    createdAt: "2026-06-01T08:00:00",
  },
  {
    id: "audit-2",
    actorId: "user-2",
    action: "PUBLISHED_ANNOUNCEMENT",
    entityType: "announcement",
    entityId: "ann-1",
    metadata: { title: "Submission window is open" },
    createdAt: "2026-06-10T09:00:00",
  },
];

export const demoSeedState = {
  users: seedUsers,
  platformRoles: seedPlatformRoles,
  hackathons: seedHackathons,
  hackathonMembers: seedHackathonMembers,
  registrations: seedRegistrations,
  teams: seedTeams,
  teamMembers: seedTeamMembers,
  teamJoinRequests: seedTeamJoinRequests,
  submissions: seedSubmissions,
  helpTickets: seedHelpTickets,
  judgeAssignments: seedJudgeAssignments,
  rubrics: seedRubrics,
  scores: seedScores,
  announcements: seedAnnouncements,
  notifications: seedNotifications,
  auditLogs: seedAuditLogs,
};
