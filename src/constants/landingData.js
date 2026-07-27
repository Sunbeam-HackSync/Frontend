// src/constants/landingData.js
// Static UI copy for the landing page — features, roles, platform highlights.
// These are NOT API data — they are permanent marketing text.

import {
  FaUsers,
  FaTrophy,
  FaCode,
  FaUserTie,
  FaGavel,
  FaLightbulb,
  FaHandsHelping,
  FaShieldAlt,
} from "react-icons/fa";

export const platformFeatures = [
  {
    id: 1,
    title: "Hackathon Management",
    description:
      "Create, manage, and monitor hackathons seamlessly with powerful organizer tools.",
    icon: FaTrophy,
  },
  {
    id: 2,
    title: "Team Collaboration",
    description:
      "Participants can create teams, invite members, and collaborate efficiently.",
    icon: FaUsers,
  },
  {
    id: 3,
    title: "Project Submission",
    description:
      "Secure and streamlined submission portal with repository and demo links.",
    icon: FaCode,
  },
  {
    id: 4,
    title: "Expert Mentoring",
    description:
      "Real-time help tickets connecting stuck teams with experienced mentors.",
    icon: FaHandsHelping,
  },
  {
    id: 5,
    title: "Structured Judging",
    description:
      "Blind-mode evaluation rubrics ensure fair, consistent scoring across all submissions.",
    icon: FaGavel,
  },
  {
    id: 6,
    title: "Platform Oversight",
    description:
      "Super admin command centre for hackathon approvals, bans, and platform analytics.",
    icon: FaShieldAlt,
  },
];

export const userRoles = [
  {
    id: 1,
    title: "Organizers",
    description:
      "Launch and manage hackathons with registrations, announcements, and judging.",
    icon: FaUserTie,
  },
  {
    id: 2,
    title: "Judges",
    description:
      "Review submissions with structured rubrics and evaluation dashboards.",
    icon: FaGavel,
  },
  {
    id: 3,
    title: "Mentors",
    description:
      "Help teams solve technical challenges using real-time support systems.",
    icon: FaLightbulb,
  },
];
