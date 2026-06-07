// src/utils/resolveHackathonRole.js

import {
    hackathonMembers
} from "../mock/hackathonMembers";

export function resolveHackathonRole(
    hackathonId,
    userId
) {

    const membership =
        hackathonMembers.find(
            (member) =>
                member.hackathonId === hackathonId &&
                member.userId === userId
        );

    return membership?.role || null;
}