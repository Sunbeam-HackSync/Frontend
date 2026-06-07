// src/routes/RoleRoute.jsx

import { Navigate } from "react-router";

import { useSelector } from "react-redux";

export default function RoleRoute({
    allowedRoles,
    children
}) {

    const { platformRoles } = useSelector(
        (state) => state.auth
    );

    const hasRole = platformRoles?.some(
        (role) => allowedRoles.includes(role)
    );

    if (!hasRole) {

        return <Navigate to="/" replace />;
    }

    return children;
}
