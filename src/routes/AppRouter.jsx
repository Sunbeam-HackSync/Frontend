// src/routes/AppRouter.jsx

import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";

// ── Public pages ──────────────────────────────────────────────────────────────
import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import HackathonsPage from "../pages/public/HackathonsPage";
import HackathonDetailsPage from "../pages/public/HackathonDetailsPage";
import NotFound from "../pages/shared/NotFound";

// ── Auth pages ────────────────────────────────────────────────────────────────
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

// ── Route guards ──────────────────────────────────────────────────────────────
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RoleRoute from "./RoleRoute";

// ── Admin feature ─────────────────────────────────────────────────────────────
import AdminDashboard from "../features/admin/pages/AdminDashboard";

// ── Host feature ──────────────────────────────────────────────────────────────
import HostDashboardPage from "../features/host/pages/HostDashboardPage";
import HostHackathonPage from "../features/host/pages/HostHackathonPage";
import HostManagePage from "../features/host/pages/HostManagePage";
import JudgeDashboardPage from "../features/judge/pages/JudgeDashboardPage";
import MentorDashboardPage from "../features/mentor/pages/MentorDashboardPage";
import MentorHackathonDetailsPage from "../features/mentor/pages/MentorHackathonDetailsPage";
import MentorWorkspacePage from "../features/mentor/pages/MentorWorkspacePage";
import JudgeHackathonDetailsPage from "../features/judge/pages/JudgeHackathonDetailsPage";
import ParticipantDashboardPage from "../features/participant/pages/ParticipantDashboardPage";
import ProfilePage from "../features/participant/pages/ProfilePage";


// ── Workspace feature (shared by all roles inside a hackathon) ────────────────
import HackathonWorkspacePage from "../features/workspace/pages/HackathonWorkspacePage";
import { WorkspaceOverviewPage } from "../features/workspace/pages/WorkspaceOverviewPage";
import { OrganizerParticipantsPage } from "../features/workspace/pages/OrganizerParticipantsPage";
import { OrganizerSubmissionsPage } from "../features/workspace/pages/OrganizerSubmissionsPage";
import { OrganizerAnnouncementsPage } from "../features/workspace/pages/OrganizerAnnouncementsPage";
import { JudgeAssignedProjectsPage } from "../features/workspace/pages/JudgeAssignedProjectsPage";
import { JudgeEvaluationPage } from "../features/workspace/pages/JudgeEvaluationPage";
import { JudgeSubmitWinnersPage } from "../features/workspace/pages/JudgeSubmitWinnersPage";

import { MentorHelpQueuePage } from "../features/workspace/pages/MentorHelpQueuePage";
import { ParticipantTeamPage } from "../features/workspace/pages/ParticipantTeamPage";
import { ParticipantSubmissionPage } from "../features/workspace/pages/ParticipantSubmissionPage";
import { ParticipantHelpPage } from "../features/workspace/pages/ParticipantHelpPage";
import Chatbot from "../features/agent/components/Chatbot";



const router = createBrowserRouter([
    // ── Public routes ──────────────────────────────────────────────────────────
    {
        path: "/",
        element: <PublicLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "about", element: <AboutPage /> },
            { path: "hackathons", element: <HackathonsPage /> },
            { path: "hackathons/:id", element: <HackathonDetailsPage /> },
            { path: "chatbot", element: <Chatbot /> },
        ],
    },

    // ── Auth routes ────────────────────────────────────────────────────────────
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>,
            },
            {
                path: "register",
                element: <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>,
            },
        ],
    },

    // ── Admin routes ───────────────────────────────────────────────────────────
    {
        path: "/admin",
        element: <RoleRoute allowedRoles={["ADMIN"]}> <AdminDashboard /> </RoleRoute>,
    },

    // ── Host routes ────────────────────────────────────────────────────────────
    {
        path: "/host-dashboard",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["HOST"]}>
                    <HostDashboardPage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/host-hackathon",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["HOST"]}>
                    <HostHackathonPage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/host/hackathon/:id/manage",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["HOST"]}>
                    <HostManagePage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    // ── Judge routes ───────────────────────────────────────────────────────────
    {
        path: "/judge-dashboard",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["JUDGE"]}>
                    <JudgeDashboardPage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/judge/hackathon/:id",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["JUDGE"]}>
                    <JudgeHackathonDetailsPage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    // ── Mentor routes ───────────────────────────────────────────────────────────
    {
        path: "/mentor-dashboard",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["MENTOR"]}>
                    <MentorDashboardPage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/mentor/hackathon/:id",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["MENTOR"]}>
                    <MentorHackathonDetailsPage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/mentor/workspace/:id",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["MENTOR"]}>
                    <MentorWorkspacePage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },

    // ── Participant routes ─────────────────────────────────────────────────────
    {
        path: "/participant-dashboard",
        element: (
            <ProtectedRoute>
                <RoleRoute allowedRoles={["PARTICIPANT"]}>
                    <ParticipantDashboardPage />
                </RoleRoute>
            </ProtectedRoute>
        ),
    },
    {
        // Profile is accessible to all authenticated roles
        path: "/profile",
        element: (
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        ),
    },

    // ── Workspace routes (role-specific tabs rendered inside) ──────────────────
    {
        path: "/workspace/:id",
        element: <ProtectedRoute><HackathonWorkspacePage /></ProtectedRoute>,
        children: [
            { index: true, element: <Navigate to="overview" replace /> },
            { path: "overview", element: <WorkspaceOverviewPage /> },
            { path: "participants", element: <OrganizerParticipantsPage /> },
            { path: "submissions", element: <OrganizerSubmissionsPage /> },
            { path: "announcements", element: <OrganizerAnnouncementsPage /> },
            { path: "team", element: <ParticipantTeamPage /> },
            { path: "submission", element: <ParticipantSubmissionPage /> },
            { path: "help", element: <ParticipantHelpPage /> },
            { path: "assigned-projects", element: <JudgeAssignedProjectsPage /> },
            { path: "evaluation", element: <JudgeEvaluationPage /> },
            { path: "submit-winners", element: <JudgeSubmitWinnersPage /> },
            { path: "help-queue", element: <MentorHelpQueuePage /> },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}