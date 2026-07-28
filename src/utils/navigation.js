// src/utils/navigation.js

/**
 * Returns the primary dashboard path for a user based on their platform roles.
 * Single source of truth used by LoginPage, OtpVerificationForm, PublicOnlyRoute, and Navbar.
 *
 * @param {string[]} platformRoles - Array of role strings from Redux auth state
 * @returns {string} React Router path
 */
export function getRoleRedirectPath(platformRoles = []) {
    if (platformRoles.includes("ADMIN"))       return "/admin";
    if (platformRoles.includes("HOST"))        return "/host-dashboard";
    if (platformRoles.includes("PARTICIPANT")) return "/participant-dashboard";
    // JUDGE, MENTOR → go to hackathon discovery (their workspace-specific UIs are role-gated inside)
    return "/hackathons";
}
