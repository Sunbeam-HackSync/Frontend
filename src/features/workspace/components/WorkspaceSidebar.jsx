// src/features/workspace/components/WorkspaceSidebar.jsx

import { NavLink, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
    FaHome, FaUsers, FaProjectDiagram, FaBullhorn,
    FaHandsHelping, FaClipboardList, FaGavel, FaBalanceScale,
    FaQuestionCircle, FaSignOutAlt, FaChevronLeft
} from "react-icons/fa";
import { logout } from "../../auth/redux/authSlice";
import { logoutUser } from "../../auth/services/authService";
import { getMyAssignedHackathons } from "../../judge/services/judgeService";
import { useState, useEffect } from "react";

const ROLE_COLORS = {
    ORGANIZER: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    PARTICIPANT: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    JUDGE: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    MENTOR: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    ADMIN: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const ROLE_LINKS = {
    ORGANIZER: [
        { name: "Overview", path: "overview", icon: FaHome },
        { name: "Participants", path: "participants", icon: FaUsers },
        { name: "Submissions", path: "submissions", icon: FaProjectDiagram },
        { name: "Announcements", path: "announcements", icon: FaBullhorn },
    ],
    PARTICIPANT: [
        { name: "Overview", path: "overview", icon: FaHome },
        { name: "My Team", path: "team", icon: FaHandsHelping },
        { name: "Submission", path: "submission", icon: FaProjectDiagram },
        { name: "Get Help", path: "help", icon: FaQuestionCircle },
    ],
    JUDGE: [
        { name: "Assigned Projects", path: "assigned-projects", icon: FaGavel },
    ],
    MENTOR: [
        { name: "Help Queue", path: "help-queue", icon: FaClipboardList },
    ],
    ADMIN: [
        { name: "Overview", path: "overview", icon: FaHome },
        { name: "Participants", path: "participants", icon: FaUsers },
        { name: "Submissions", path: "submissions", icon: FaProjectDiagram },
    ],
};

export default function WorkspaceSidebar({ role, hackathon }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSuperJudge, setIsSuperJudge] = useState(false);

    useEffect(() => {
        if (role === "JUDGE" && hackathon?.id) {
            getMyAssignedHackathons().then((assignments) => {
                const current = assignments.find(a => a.hackathonId === hackathon.id);
                if (current && current.isSuperJudge) {
                    setIsSuperJudge(true);
                }
            }).catch(() => { });
        }
    }, [role, hackathon?.id]);

    let links = ROLE_LINKS[role] || ROLE_LINKS.PARTICIPANT;
    if (role === "JUDGE" && isSuperJudge) {
        // Create a copy and add Submit Winners
        links = [...links, { name: "Submit Winners", path: "submit-winners", icon: FaBalanceScale }];
    }

    const roleColorClass = ROLE_COLORS[role] || ROLE_COLORS.PARTICIPANT;

    async function handleLogout() {
        await logoutUser();
        dispatch(logout());
        navigate("/login");
    }

    const backNav = {
        ORGANIZER: { path: "/host-dashboard", label: "Host Dashboard" },
        JUDGE: { path: "/judge-dashboard", label: "Judge Dashboard" },
        ADMIN: { path: "/admin", label: "Admin Dashboard" },
        MENTOR: { path: "/hackathons", label: "All Hackathons" },
        PARTICIPANT: { path: "/hackathons", label: "All Hackathons" }
    }[role] || { path: "/hackathons", label: "All Hackathons" };

    return (
        <aside className="flex w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            {/* Header */}
            <div className="border-b border-slate-800 p-5">
                <button
                    onClick={() => navigate(backNav.path)}
                    className="mb-4 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <FaChevronLeft size={10} />
                    {backNav.label}
                </button>

                <h2 className="text-base font-bold leading-snug text-white line-clamp-2">
                    {hackathon?.title || "Hackathon"}
                </h2>

                <span className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleColorClass}`}>
                    {role}
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                    ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={14} className="flex-shrink-0" />
                            {link.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                    <FaSignOutAlt size={14} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
