import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getHackathonById, updateInvitationStatus } from "../services/judgeService";
import { FaArrowLeft, FaCheck, FaTimes, FaCalendarAlt, FaTag, FaInfoCircle, FaTrophy, FaUsers, FaRegCalendarCheck, FaGavel, FaQuestionCircle, FaClock } from "react-icons/fa";

function formatDateTime(dateString, fallback = 'TBA') {
    if (!dateString) return fallback;
    return new Date(dateString).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function JudgeHackathonDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hackathon, setHackathon] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setIsLoading(true);
            const data = await getHackathonById(id);
            setHackathon(data);
        } catch (error) {
            toast.error("Failed to load hackathon details.");
            navigate("/judge-dashboard");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleStatus(status) {
        try {
            setUpdating(true);
            await updateInvitationStatus(id, status);
            toast.success(`Invitation ${status.toLowerCase()} successfully`);
            loadData();
        } catch (err) {
            toast.error("Failed to update invitation status");
        } finally {
            setUpdating(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 flex justify-center items-center">
                <div className="animate-spin h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!hackathon) return null;

    const isPending = hackathon.status === "INVITED" || hackathon.status === "PENDING";
    const isAccepted = hackathon.status === "ACCEPTED";
    const isDeclined = hackathon.status === "DECLINED" || hackathon.status === "REJECTED";

    const details = hackathon.hackathons || {};

    return (
        <div className="min-h-screen bg-slate-950 py-12 text-white">
            <div className="mx-auto max-w-5xl px-5 md:px-8">
                <button
                    onClick={() => navigate("/judge-dashboard")}
                    className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>

                {/* Main Content Card */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl overflow-hidden">
                    {/* Banner Image */}
                    {details.bannerImageUrl && (
                        <div className="h-48 md:h-64 w-full relative bg-slate-800">
                            <img src={details.bannerImageUrl} alt="Hackathon Banner" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        </div>
                    )}

                    <div className="p-8 md:p-12 relative -mt-16 md:-mt-24 z-10">
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg ${isPending ? "bg-amber-900/90 text-amber-300 border-amber-700/60" :
                                isAccepted ? "bg-emerald-900/90 text-emerald-300 border-emerald-700/60" :
                                    "bg-red-900/90 text-red-300 border-red-700/60"
                                }`}>
                                {hackathon.status || "UNKNOWN"}
                            </span>
                            {hackathon.isSuperJudge && (
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-slate-900/80 px-3 py-1 rounded-full border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)] backdrop-blur-md">
                                    Super Judge
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                            {details.profileImageUrl && (
                                <img src={details.profileImageUrl} alt="Profile" className="w-24 h-24 rounded-2xl border-4 border-slate-900 object-cover shadow-xl bg-slate-800 shrink-0" />
                            )}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                                    {details.title || `Hackathon #${details.id}`}
                                </h1>
                                {details.tagline && (
                                    <p className="mt-3 text-xl text-slate-400 font-light">
                                        {details.tagline}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex items-start gap-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                    <FaRegCalendarCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Registration</p>
                                    <p className="text-sm font-medium">
                                        {formatDateTime(details.registrationStart)} <br />
                                        to <br />
                                        {formatDateTime(details.registrationEnd)}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex items-start gap-4">
                                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                                    <FaCalendarAlt size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Hackathon</p>
                                    <p className="text-sm font-medium">
                                        {formatDateTime(details.hackathonStart)} <br />
                                        to <br />
                                        {formatDateTime(details.hackathonEnd)}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex items-start gap-4">
                                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                                    <FaClock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Results Date</p>
                                    <p className="text-sm font-medium">
                                        {formatDateTime(details.resultDeclarationDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex items-start gap-4">
                                <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
                                    <FaUsers size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Team Size</p>
                                    <p className="text-sm font-medium">{details.minTeamSize || '?'} - {details.maxTeamSize || '?'} members</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex items-start gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                    <FaTag size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                                    <p className="text-sm font-medium">{details.hackathonStatus}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex items-start gap-4">
                                <div className="p-3 bg-slate-500/10 text-slate-400 rounded-xl">
                                    <FaInfoCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Assigned On</p>
                                    <p className="text-sm font-medium">{formatDateTime(hackathon.assignedAt, 'N/A')}</p>
                                </div>
                            </div>
                        </div>

                        {details.description && (
                            <div className="mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-sky-400 uppercase tracking-wider">
                                    <FaInfoCircle /> About
                                </h2>
                                <div className="prose prose-invert max-w-none text-slate-300">
                                    {details.description}
                                </div>
                            </div>
                        )}

                        {details.rules && (
                            <div className="mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400 uppercase tracking-wider">
                                    <FaGavel /> Rules & Guidelines
                                </h2>
                                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                                    {details.rules}
                                </div>
                            </div>
                        )}

                        {details.faq && (
                            <div className="mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-pink-400 uppercase tracking-wider">
                                    <FaQuestionCircle /> FAQ
                                </h2>
                                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                                    {details.faq}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4 border-t border-slate-800 pt-8">
                            {isPending && (
                                <>
                                    <button
                                        disabled={updating}
                                        onClick={() => handleStatus("ACCEPTED")}
                                        className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-4 px-6 text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 disabled:opacity-50"
                                    >
                                        <FaCheck size={18} /> Approve Invitation
                                    </button>
                                    <button
                                        disabled={updating}
                                        onClick={() => handleStatus("DECLINED")}
                                        className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-slate-800 py-4 px-6 text-sm font-bold text-red-400 border border-red-500/30 transition-all hover:bg-red-500/10 active:scale-95 disabled:opacity-50"
                                    >
                                        <FaTimes size={18} /> Reject Invitation
                                    </button>
                                </>
                            )}

                            {isAccepted && (
                                <button
                                    onClick={() => navigate(`/workspace/${details.id}/assigned-projects`)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-4 px-8 text-sm font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] active:scale-95"
                                >
                                    <FaTrophy size={18} /> Enter Judging Workspace
                                </button>
                            )}

                            {isDeclined && (
                                <div className="w-full text-center py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-slate-400">
                                    You have declined the invitation for this hackathon.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
