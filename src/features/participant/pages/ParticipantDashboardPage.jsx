// src/features/participant/pages/ParticipantDashboardPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaArrowRight, FaRocket, FaSearch } from "react-icons/fa";

import { getMyHackathons } from "../services/participantService";
import Navbar from "../../../components/layout/Navbar";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    APPROVED:  { bg: "bg-emerald-900/40 border-emerald-700/40", text: "text-emerald-300", dot: "bg-emerald-400" },
    ACTIVE:    { bg: "bg-blue-900/40 border-blue-700/40",       text: "text-blue-300",    dot: "bg-blue-400"    },
    COMPLETED: { bg: "bg-slate-700/40 border-slate-600/40",     text: "text-slate-300",   dot: "bg-slate-400"   },
    DRAFT:     { bg: "bg-amber-900/40 border-amber-700/40",     text: "text-amber-300",   dot: "bg-amber-400"   },
    PUBLISHED: { bg: "bg-indigo-900/40 border-indigo-700/40",   text: "text-indigo-300",  dot: "bg-indigo-400"  },
    REJECTED:  { bg: "bg-red-900/40 border-red-700/40",         text: "text-red-300",     dot: "bg-red-400"     },
};

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="h-40 bg-slate-800" />
            <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-slate-800" />
                <div className="h-4 w-1/2 rounded bg-slate-800" />
                <div className="h-10 rounded-xl bg-slate-800 mt-4" />
            </div>
        </div>
    );
}

// ─── Hackathon card ───────────────────────────────────────────────────────────
function HackathonCard({ hackathon }) {
    return (
        <div className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-indigo-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/50">

            {/* Banner */}
            <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-800">
                {hackathon.bannerImageUrl ? (
                    <img
                        src={hackathon.bannerImageUrl}
                        alt={hackathon.title}
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <FaRocket className="text-indigo-500/30" size={48} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                    <StatusBadge status={hackathon.hackathonStatus} />
                </div>
                {hackathon.profileImageUrl && (
                    <img
                        src={hackathon.profileImageUrl}
                        alt=""
                        className="absolute bottom-3 right-3 h-10 w-10 rounded-xl object-cover border-2 border-slate-700"
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
                    {hackathon.title}
                </h3>
                <p className="mt-1 text-sm text-indigo-300 line-clamp-1">{hackathon.tagline}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <FaCalendarAlt size={11} />
                    <span>{fmtDate(hackathon.hackathonStart)} — {fmtDate(hackathon.hackathonEnd)}</span>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                    Team size: {hackathon.minTeamSize}–{hackathon.maxTeamSize} members
                </div>

                <div className="mt-auto pt-4">
                    <Link
                        to={`/workspace/${hackathon.id}/overview`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Open Workspace
                        <FaArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 py-20 text-center">
            <FaRocket className="mb-4 text-slate-600" size={40} />
            <h3 className="text-xl font-bold text-white">No Hackathons Yet</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
                You haven't joined any hackathons. Browse open hackathons and create your team to get started.
            </p>
            <Link
                to="/hackathons"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
                <FaSearch size={13} />
                Browse Hackathons
            </Link>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ParticipantDashboardPage() {
    const [hackathons, setHackathons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMyHackathons()
            .then(setHackathons)
            .catch((err) => toast.error(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            {/* Dashboard Header */}
            <div className="border-b border-slate-800 bg-slate-900/40 px-5 py-8">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Dashboard</p>
                        <h1 className="mt-1 text-3xl font-bold">My Hackathons</h1>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/hackathons"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                        >
                            <FaSearch size={12} />
                            Browse Hackathons
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-6xl px-5 py-10">
                {isLoading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
                    </div>
                ) : hackathons.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <p className="mb-6 text-sm text-slate-400">{hackathons.length} hackathon{hackathons.length !== 1 ? "s" : ""} registered</p>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {hackathons.map((h) => (
                                <HackathonCard key={h.id} hackathon={h} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
