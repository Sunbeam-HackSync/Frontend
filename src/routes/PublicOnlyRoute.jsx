// /src/routes/PublicOnlyRoute.jsx

import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { getRoleRedirectPath } from "../utils/navigation";

/**
 * Blocks access to auth pages (login, register) for already-authenticated users.
 * Redirects to their role-appropriate dashboard.
 */
export default function PublicOnlyRoute({ children }) {
    const { isAuthenticated, platformRoles } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        return <Navigate to={getRoleRedirectPath(platformRoles)} replace />;
    }

    return children;
}
