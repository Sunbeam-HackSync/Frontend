// src/features/workspace/hooks/useHackathonRole.js

import { useMemo } from "react";
import { useSelector } from "react-redux";

// eslint-disable-next-line no-unused-vars
export default function useHackathonRole(hackathonId) {
    const { user, platformRoles } = useSelector((state) => state.auth);

    const role = useMemo(() => {
        if (!user || !platformRoles) return null;
        
        if (platformRoles.includes("ADMIN") || platformRoles.includes("SUPER_ADMIN")) return "ADMIN";
        if (platformRoles.includes("HOST")) return "ORGANIZER";
        if (platformRoles.includes("JUDGE")) return "JUDGE";
        if (platformRoles.includes("MENTOR")) return "MENTOR";
        
        return "PARTICIPANT";
    }, [user, platformRoles]);

    return role;
}
