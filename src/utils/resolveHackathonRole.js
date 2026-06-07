// src/utils/resolveHackathonRole.js

import { getDemoState } from "../services/demoStore";

export function resolveHackathonRole(
    hackathonId,
    userId
) {

    const membership =
        getDemoState().hackathonMembers.find(
            (member) =>
                member.hackathonId === hackathonId &&
                member.userId === userId
        );

    return membership?.role || null;
}
