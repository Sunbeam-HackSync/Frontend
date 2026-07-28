// src/features/workspace/pages/WorkspaceOverviewPage.jsx

import { useEffect, useState } from "react";
import { useParams, useOutletContext, Link } from "react-router";
import { FaCalendarAlt, FaUsers, FaShieldAlt, FaArrowRight } from "react-icons/fa";

import { getMyHackathonDetails } from "../../participant/services/participantService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
    APPROVED:  "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
    ACTIVE:    "bg-blue-900/40 text-blue-300 border-blue-700/40",
    COMPLETED: "bg-slate-700/40 text-slate-300 border-slate-600/40",
    DRAFT:     "bg-amber-900/40 text-amber-300 border-amber-700/40",
    PUBLISHED: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
    REJECTED:  "bg-red-900/40 text-red-300 border-red-700/40",
};

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }) {
    return (
        <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.DRAFT}`}>
            {status}
        </span>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-start gap-3 border-b border-slate-800 py-2.5 last:border-0">
            <span className="w-36 flex-shrink-0 text-sm text-slate-400">{label}</span>
            <span className="text-sm font-medium text-white">{value || "—"}</span>
        </div>
    );
}

function QuickLink({ to, label }) {
    return (
        <Link
            to={to}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-indigo-700/60 hover:text-indigo-300"
        >
            {label}
            <FaArrowRight size={11} className="text-slate-500" />
        </Link>
    );
}

// ─── Participant overview ─────────────────────────────────────────────────────
function ParticipantOverview({ hackathon, details }) {
    const { id } = useParams();
    const teamDetails = details?.teamDetails;
    const hackathonData = details?.hackathonDetails || hackathon;

    if (!teamDetails) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
                <FaUsers className="mx-auto mb-3 text-slate-600" size={32} />
                <h3 className="text-lg font-bold text-white">No Team Yet</h3>
                <p className="mt-2 text-sm text-slate-400">Create or join a team to start participating in this hackathon.</p>
                <Link
                    to="team"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
                >
                    Go to Teams
                    <FaArrowRight size={11} />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Team card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">My Team</h2>
                    <span className="rounded-full bg-indigo-900/40 border border-indigo-700/40 px-3 py-0.5 text-xs font-semibold text-indigo-300">
                        Team #{teamDetails.teamId}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-indigo-300">{teamDetails.teamName}</h3>

                {/* Members */}
                <div className="mt-5 space-y-2">
                    {teamDetails.participants?.map((p) => (
                        <div
                            key={p.userId}
                            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                        >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-900/50 text-xs font-bold text-indigo-300">
                                {(p.fullName || p.email || "?")[0].toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{p.fullName || p.email}</p>
                                <p className="truncate text-xs text-slate-400">{p.email}</p>
                            </div>
                            {p.teamLeader && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-900/40 border border-amber-700/40 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                                    <FaShieldAlt size={9} /> Leader
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hackathon timeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-bold text-white">Hackathon Timeline</h2>
                <InfoRow label="Registration Ends" value={fmtDate(hackathonData?.registrationEnd)} />
                <InfoRow label="Hackathon Starts"  value={fmtDate(hackathonData?.hackathonStart)} />
                <InfoRow label="Hackathon Ends"    value={fmtDate(hackathonData?.hackathonEnd)} />
                <InfoRow label="Team Size"         value={`${hackathonData?.minTeamSize}–${hackathonData?.maxTeamSize} members`} />
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-bold text-white">Quick Links</h2>
                <div className="space-y-2">
                    <QuickLink to="team"       label="Manage Team" />
                    <QuickLink to="submission" label="Submit Project" />
                    <QuickLink to="help"       label="Get Help from Mentor" />
                </div>
            </div>
        </div>
    );
}

// ─── Organizer overview ───────────────────────────────────────────────────────
function OrganizerOverview({ hackathon }) {
    const { id } = useParams();
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-bold text-white">Hackathon Details</h2>
                <InfoRow label="Status"              value={hackathon?.hackathonStatus} />
                <InfoRow label="Team Size"           value={`${hackathon?.minTeamSize}–${hackathon?.maxTeamSize}`} />
                <InfoRow label="Registration Starts" value={fmtDate(hackathon?.registrationStart)} />
                <InfoRow label="Registration Ends"   value={fmtDate(hackathon?.registrationEnd)} />
                <InfoRow label="Hackathon Starts"    value={fmtDate(hackathon?.hackathonStart)} />
                <InfoRow label="Hackathon Ends"      value={fmtDate(hackathon?.hackathonEnd)} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-bold text-white">Quick Links</h2>
                <div className="space-y-2">
                    <QuickLink to="participants"  label="Manage Participants" />
                    <QuickLink to="submissions"   label="View Submissions" />
                    <QuickLink to="announcements" label="Post Announcements" />
                </div>
            </div>
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function WorkspaceOverviewPage() {
    const { id } = useParams();
    const { role, hackathon } = useOutletContext();
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (role === "PARTICIPANT") {
            setIsLoading(true);
            getMyHackathonDetails(id)
                .then(setDetails)
                .catch(console.warn)
                .finally(() => setIsLoading(false));
        }
    }, [id, role]);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">{role} Workspace</p>
                    <h1 className="mt-1 text-2xl font-bold text-white">{hackathon?.title || "Overview"}</h1>
                    {hackathon?.tagline && <p className="mt-1 text-indigo-300">{hackathon.tagline}</p>}
                </div>
                {hackathon?.hackathonStatus && <StatusBadge status={hackathon.hackathonStatus} />}
            </div>

            {/* Banner */}
            {hackathon?.bannerImageUrl && (
                <img
                    src={hackathon.bannerImageUrl}
                    alt="Banner"
                    className="w-full h-44 rounded-2xl object-cover border border-slate-800"
                />
            )}

            {/* Role-based content */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map((k) => (
                        <div key={k} className="animate-pulse h-40 rounded-2xl bg-slate-900 border border-slate-800" />
                    ))}
                </div>
            ) : role === "PARTICIPANT" ? (
                <ParticipantOverview hackathon={hackathon} details={details} />
            ) : (
                <OrganizerOverview hackathon={hackathon} />
            )}
        </div>
    );
}
