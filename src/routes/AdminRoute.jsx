// src/routes/AdminRoute.jsx

import { Navigate } from "react-router";

import { useSelector } from "react-redux";

export default function AdminRoute({
    children
}) {

    const {
        isAuthenticated,
        platformRoles
    } = useSelector(
        (state) => state.auth
    );

    if (!isAuthenticated) {

        return <Navigate to="/login" />;
    }

    const isAdmin =
        platformRoles.includes(
            "SUPER_ADMIN"
        );

    if (!isAdmin) {

        return <Navigate to="/" />;
    }

    return children;
}