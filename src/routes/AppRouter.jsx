// /src/routes/AppRouter.jsx

import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import PublicLayout from "../layouts/PublicLayout";

import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import HackathonsPage from "../pages/public/HackathonsPage";
import HackathonDetailsPage from "../pages/public/HackathonDetailsPage";

import NotFound from "../pages/shared/NotFound";

import LoginPage from "../features/auth/pages/LoginPage";

import RegisterPage from "../features/auth/pages/RegisterPage";

import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import HackathonWorkspacePage from "../pages/workspace/HackathonWorkspacePage";
import {
    JudgeAssignedProjectsPage,
    JudgeEvaluationPage,
    MentorHelpQueuePage,
    OrganizerAnnouncementsPage,
    OrganizerParticipantsPage,
    OrganizerSubmissionsPage,
    ParticipantHelpPage,
    ParticipantSubmissionPage,
    ParticipantTeamPage,
    WorkspaceOverviewPage,
} from "../pages/workspace/WorkspacePages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            {
                path: "about",
                element: <AboutPage />
            },
            {
                path: "hackathons",
                element: <HackathonsPage />
            },
            {
                path: "hackathons/:slug",
                element: <HackathonDetailsPage />
            }
        ]
    },
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "register",
                element: <RegisterPage />
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminDashboard />
            </AdminRoute>
        )
    },
    {
        path: "/workspace/:slug",
        element: (
            <ProtectedRoute>
                <HackathonWorkspacePage />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="overview" replace />
            },
            {
                path: "overview",
                element: <WorkspaceOverviewPage />
            },
            {
                path: "participants",
                element: <OrganizerParticipantsPage />
            },
            {
                path: "submissions",
                element: <OrganizerSubmissionsPage />
            },
            {
                path: "announcements",
                element: <OrganizerAnnouncementsPage />
            },
            {
                path: "team",
                element: <ParticipantTeamPage />
            },
            {
                path: "submission",
                element: <ParticipantSubmissionPage />
            },
            {
                path: "help",
                element: <ParticipantHelpPage />
            },
            {
                path: "assigned-projects",
                element: <JudgeAssignedProjectsPage />
            },
            {
                path: "evaluation",
                element: <JudgeEvaluationPage />
            },
            {
                path: "help-queue",
                element: <MentorHelpQueuePage />
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
