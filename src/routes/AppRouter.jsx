// /src/routes/AppRouter.jsx

import { createBrowserRouter, RouterProvider } from "react-router";

import PublicLayout from "../layouts/PublicLayout";

import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";

import NotFound from "../pages/shared/NotFound";

import LoginPage from "../features/auth/pages/LoginPage";

import RegisterPage from "../features/auth/pages/RegisterPage";

import AuthLayout from '../layouts/AuthLayout';

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
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}