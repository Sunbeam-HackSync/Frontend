// /src/routes/PublicOnlyRoute.jsx

import { Navigate } from "react-router";

import { useSelector } from "react-redux";

export default function PublicOnlyRoute({
    children
}) {
    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );
    if (isAuthenticated) {

        return <Navigate to="/" replace />;
    }
    return children;
}
