// src/hooks/useHackathonRole.js

import { useMemo } from "react";

import { useSelector } from "react-redux";

import { getDemoState } from "../services/demoStore";

export default function useHackathonRole(
    hackathonId
) {

    const { user } = useSelector(
        (state) => state.auth
    );

    const role = useMemo(() => {

        if (!user) return null;

        const membership =
            getDemoState().hackathonMembers.find(
                (member) =>
                    member.hackathonId === hackathonId &&
                    member.userId === user.id
            );

        return membership?.role || null;

    }, [hackathonId, user]);

    return role;
}
