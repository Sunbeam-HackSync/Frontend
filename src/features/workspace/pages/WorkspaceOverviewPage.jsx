// src/features/workspace/pages/WorkspaceOverviewPage.jsx

import { useEffect, useState } from "react";
import { useParams, useOutletContext, Link } from "react-router";
import { FaCalendarAlt, FaUsers, FaShieldAlt, FaArrowRight, FaPlusCircle } from "react-icons/fa";

import { getMyHackathonDetails, getHackathonResult, getHackathonWinners } from "../../participant/services/participantService";
import { FaTrophy, FaMedal } from "react-icons/fa";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
    APPROVED: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
    ACTIVE: "bg-blue-900/40 text-blue-300 border-blue-700/40",
    COMPLETED: "bg-slate-700/40 text-slate-300 border-slate-600/40",
    DRAFT: "bg-amber-900/40 text-amber-300 border-amber-700/40",
    PUBLISHED: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
    REJECTED: "bg-red-900/40 text-red-300 border-red-700/40",
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
function ParticipantOverview({ hackathon, details, result }) {
    const { id } = useParams();
    const teamDetails = details?.teamDetails;
    const hackathonData = details?.hackathonDetails || hackathon;

    return (
        <div className="space-y-6">
            {/* Hackathon Results Card */}
            {result && (
                <div className="rounded-2xl border border-indigo-800/40 bg-indigo-900/10 p-6 relative overflow-hidden shadow-lg shadow-indigo-900/5">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                    <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
                        <FaTrophy className="text-amber-400" /> Evaluation Results
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-center shadow-inner">
                            <p className="text-sm text-slate-400 font-semibold tracking-wide uppercase mb-1">Total Score</p>
                            <p className="text-4xl font-black text-white tabular-nums tracking-tight">
                                {result.totalScore ?? result.score ?? "—"}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-center shadow-inner">
                            <p className="text-sm text-slate-400 font-semibold tracking-wide uppercase mb-1">Status</p>
                            {(result.isWinner || result.categoryName || result.category) ? (
                                <div>
                                    <p className="text-2xl font-bold text-emerald-400 drop-shadow-sm">Winner! 🎉</p>
                                    {(result.categoryName || result.category) && (
                                        <span className="inline-block mt-2 rounded-full bg-emerald-900/40 border border-emerald-700/40 px-3 py-1 text-xs font-bold text-emerald-300 shadow-sm">
                                            {result.categoryName || result.category}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-2xl font-bold text-slate-200">Participant</p>
                                    <p className="mt-1 text-xs text-slate-400">Great effort! Keep building.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Team card */}
            {!teamDetails ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
                    <FaUsers className="mx-auto mb-3 text-slate-600" size={32} />
                    <h3 className="text-lg font-bold text-white">No Team Yet</h3>
                    <p className="mt-2 text-sm text-slate-400">Create or join a team to start participating in this hackathon.</p>
                    <Link
                        to={`/workspace/${id}/team`}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition text-center"
                    >
                        Create Teams
                        <FaPlusCircle className="text-white" size={18} />
                    </Link>
                </div>
            ) : (
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
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hackathon timeline */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="mb-4 text-lg font-bold text-white">Hackathon Timeline</h2>
                    <InfoRow label="Registration Ends" value={fmtDate(hackathonData?.registrationEnd)} />
                    <InfoRow label="Hackathon Starts" value={fmtDate(hackathonData?.hackathonStart)} />
                    <InfoRow label="Hackathon Ends" value={fmtDate(hackathonData?.hackathonEnd)} />
                    <InfoRow label="Team Size" value={`${hackathonData?.minTeamSize}–${hackathonData?.maxTeamSize} members`} />
                </div>

                {/* Quick links */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="mb-4 text-lg font-bold text-white">Quick Links</h2>
                    <div className="space-y-2">
                        <QuickLink to={`/workspace/${id}/team`} label="Manage Team" />
                        <QuickLink to={`/workspace/${id}/submission`} label="Submit Project" />
                        <QuickLink to={`/workspace/${id}/help`} label="Get Help from Mentor" />
                    </div>
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
                <InfoRow label="Status" value={hackathon?.hackathonStatus} />
                <InfoRow label="Team Size" value={`${hackathon?.minTeamSize}–${hackathon?.maxTeamSize}`} />
                <InfoRow label="Registration Starts" value={fmtDate(hackathon?.registrationStart)} />
                <InfoRow label="Registration Ends" value={fmtDate(hackathon?.registrationEnd)} />
                <InfoRow label="Hackathon Starts" value={fmtDate(hackathon?.hackathonStart)} />
                <InfoRow label="Hackathon Ends" value={fmtDate(hackathon?.hackathonEnd)} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-bold text-white">Quick Links</h2>
                <div className="space-y-2">
                    <QuickLink to="participants" label="Manage Participants" />
                    <QuickLink to="submissions" label="View Submissions" />
                    <QuickLink to="announcements" label="Post Announcements" />
                </div>
            </div>
        </div>
    );
}

// ─── Winners Board ──────────────────────────────────────────────────────────────
function WinnersBoard({ winners, status }) {
    const isDeclared = (status === "PUBLISHED" || status === "COMPLETED") && winners && winners.length > 0;

    if (!isDeclared) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 relative overflow-hidden shadow-lg mt-8">
                <h2 className="mb-6 text-xl font-bold text-slate-300 flex items-center gap-2">
                    <FaMedal className="text-slate-500 text-2xl" /> Hall of Fame
                </h2>
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
                    <p className="text-slate-400 font-medium text-lg">Results are not declared yet.</p>
                    <p className="text-sm text-slate-500 mt-1">Check back later once the evaluation is complete and published.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-amber-800/40 bg-amber-900/10 p-6 relative overflow-hidden shadow-lg mt-8">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
                <FaMedal className="text-amber-400 text-2xl" /> Hall of Fame
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {winners.map((winner, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-center shadow-inner relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <p className="text-sm text-amber-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 drop-shadow-sm">
                            <FaTrophy size={14} /> {winner.categoryName || "Winner"}
                        </p>
                        <h3 className="text-xl font-black text-white tracking-tight drop-shadow-sm line-clamp-2">
                            {winner.projectTitle || winner.projectName || "Winning Project"}
                        </h3>
                        <p className="text-sm text-slate-400 mt-2">
                            Team: <span className="text-slate-200 font-semibold">{winner.teamName || "N/A"}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function WorkspaceOverviewPage() {
    const { id } = useParams();
    const { role, hackathon } = useOutletContext();
    const [details, setDetails] = useState(null);
    const [result, setResult] = useState(null);
    const [winners, setWinners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (role === "PARTICIPANT") {
            setIsLoading(true);
            Promise.allSettled([
                getMyHackathonDetails(id),
                getHackathonResult(id)
            ])
                .then(([detailsRes, resultRes]) => {
                    if (detailsRes.status === "fulfilled") setDetails(detailsRes.value);
                    if (resultRes.status === "fulfilled" && resultRes.value) setResult(resultRes.value);
                })
                .finally(() => setIsLoading(false));
        }
    }, [id, role]);

    useEffect(() => {
        if (hackathon?.hackathonStatus === "PUBLISHED") {
            getHackathonWinners(id)
                .then((data) => {
                    if (Array.isArray(data)) setWinners(data);
                })
                .catch(console.warn);
        }
    }, [id, hackathon?.hackathonStatus]);

    return (
        <div className="space-y-6">
            {/* Hero Header */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl mb-8">
                {/* Banner Image */}
                <div className="relative h-48 md:h-56 bg-slate-800">
                    {hackathon?.bannerImageUrl && (
                        <img
                            src={hackathon.bannerImageUrl}
                            alt="Banner"
                            className="absolute inset-0 w-full h-full object-cover opacity-70"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

                    {/* Status Badge in corner */}
                    {hackathon?.hackathonStatus && (
                        <div className="absolute top-5 right-5">
                            <StatusBadge status={hackathon.hackathonStatus} />
                        </div>
                    )}
                </div>

                {/* Profile and Titles */}
                <div className="relative px-6 pb-8 sm:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-20 mb-6">
                        {hackathon?.profileImageUrl ? (
                            <img
                                src={hackathon.profileImageUrl}
                                alt="Profile"
                                className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-800 shrink-0 relative z-10"
                            />
                        ) : (
                            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl border-4 border-slate-950 shadow-2xl bg-slate-800 flex items-center justify-center text-4xl shrink-0 relative z-10">🏆</div>
                        )}

                        <div className="flex-1 pb-1 mt-2 sm:mt-0">
                            <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold mb-1">{role} Workspace</p>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                                {hackathon?.title || "Overview"}
                            </h1>
                            {hackathon?.tagline && (
                                <p className="text-sm sm:text-base text-indigo-200 mt-1.5 font-medium drop-shadow-sm">
                                    {hackathon.tagline}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {hackathon?.description && (
                        <div className="mt-2 pt-6 border-t border-slate-800/60">
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                {hackathon.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Role-based content */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map((k) => (
                        <div key={k} className="animate-pulse h-40 rounded-2xl bg-slate-900 border border-slate-800" />
                    ))}
                </div>
            ) : role === "PARTICIPANT" ? (
                <ParticipantOverview hackathon={hackathon} details={details} result={result} />
            ) : (
                <OrganizerOverview hackathon={hackathon} />
            )}

            {/* Winners Board */}
            <WinnersBoard winners={winners} status={hackathon?.hackathonStatus} />
        </div>
    );
}
