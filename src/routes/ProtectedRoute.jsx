// src/routes/ProtectedRoute.jsx

import { Navigate } from "react-router";

import { useSelector } from "react-redux";

export default function ProtectedRoute({
    children
}) {

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;
    }

    return children;
}