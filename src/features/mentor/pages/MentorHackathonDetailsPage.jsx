import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getHackathonDetailsPublic, getMyAssignedHackathons, updateInvitationStatus } from "../services/mentorService";
import { FaArrowLeft, FaCheck, FaTimes, FaCalendarAlt, FaInfoCircle, FaUsers, FaTools, FaCode } from "react-icons/fa";
import Navbar from "../../../components/layout/Navbar";
import Button from "../../../components/ui/Button";

function formatDateTime(dateString, fallback = 'TBA') {
    if (!dateString) return fallback;
    return new Date(dateString).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function MentorHackathonDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hackathon, setHackathon] = useState(null);
    const [mentorStatus, setMentorStatus] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function loadData() {
        try {
            setIsLoading(true);
            // 1. Fetch public details
            const publicData = await getHackathonDetailsPublic(id);
            setHackathon(publicData);

            // 2. Fetch mentor's assigned hackathons to find their specific status for this hackathon
            const assignedList = await getMyAssignedHackathons();
            const myAssignment = assignedList.find(h => h.hackathonId === parseInt(id));
            if (myAssignment) {
                setMentorStatus(myAssignment);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load hackathon details.");
            navigate("/mentor-dashboard");
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
            console.error(err);
            toast.error("Failed to update invitation status");
        } finally {
            setUpdating(false);
        }
    }

    if (isLoading) {
        return (
            <>
                <Navbar hideLinks={true} />
                <div className="min-h-screen bg-slate-950 p-8 flex justify-center items-center">
                    <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                </div>
            </>
        );
    }

    if (!hackathon || !mentorStatus) return null;

    const isPending = mentorStatus.invitationStatus === "INVITED" || mentorStatus.invitationStatus === "PENDING";
    const isAccepted = mentorStatus.invitationStatus === "ACCEPTED";

    return (
        <>
            <Navbar hideLinks={true} />
            <div className="min-h-screen bg-slate-950 py-12 text-white">
                <div className="mx-auto max-w-5xl px-5 md:px-8">
                    <button
                        onClick={() => navigate("/mentor-dashboard")}
                        className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </button>

                    {/* Main Content Card */}
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl overflow-hidden">
                        {/* Banner Image */}
                        {hackathon.bannerImageUrl && (
                            <div className="h-48 md:h-64 w-full relative bg-slate-800">
                                <img src={hackathon.bannerImageUrl} alt="Hackathon Banner" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            </div>
                        )}

                        <div className="p-8 md:p-12 relative -mt-16 md:-mt-24 z-10">
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg ${isPending ? "bg-amber-900/90 text-amber-300 border-amber-700/60" :
                                        isAccepted ? "bg-indigo-900/90 text-indigo-300 border-indigo-700/60" :
                                            "bg-red-900/90 text-red-300 border-red-700/60"
                                    }`}>
                                    {mentorStatus.invitationStatus || "UNKNOWN"}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                                {hackathon.profileImageUrl && (
                                    <img
                                        src={hackathon.profileImageUrl}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-2xl object-cover border-4 border-slate-800 shadow-xl"
                                    />
                                )}
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                                        {hackathon.title}
                                    </h1>
                                    {hackathon.tagline && (
                                        <p className="text-lg text-indigo-300/80 font-medium">{hackathon.tagline}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="mb-12 rounded-2xl border border-slate-800 bg-slate-950/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Mentor Invitation</h3>
                                    <p className="text-sm text-slate-400">
                                        {isPending ? "You have been invited to mentor teams for this hackathon." :
                                            isAccepted ? "You are an official mentor for this hackathon!" :
                                                "You have declined this mentor invitation."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {isPending && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleStatus('REJECTED')}
                                                disabled={updating}
                                                className="flex items-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                            >
                                                <FaTimes /> Decline
                                            </Button>
                                            <Button
                                                onClick={() => handleStatus('ACCEPTED')}
                                                disabled={updating}
                                                className="flex items-center gap-2"
                                            >
                                                <FaCheck /> Accept Invitation
                                            </Button>
                                        </>
                                    )}

                                    {isAccepted && (
                                        <Button
                                            onClick={() => navigate(`/mentor/workspace/${hackathon.id}`)}
                                            className="flex items-center gap-2"
                                        >
                                            <FaTools /> Enter Workspace
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800">
                                            <FaInfoCircle className="text-indigo-400" /> About
                                        </h3>
                                        <div className="text-slate-300 prose prose-invert prose-sm max-w-none">
                                            {hackathon.description || "No description provided."}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800">
                                            <FaCode className="text-indigo-400" /> Rules & Requirements
                                        </h3>
                                        <div className="text-slate-300 prose prose-invert prose-sm max-w-none">
                                            {hackathon.rules || "No rules specified."}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Schedule</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                    <FaCalendarAlt size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">Hackathon Starts</p>
                                                    <p className="text-sm text-slate-400">{formatDateTime(hackathon.hackathonStart)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                    <FaCalendarAlt size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">Hackathon Ends</p>
                                                    <p className="text-sm text-slate-400">{formatDateTime(hackathon.hackathonEnd)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Team Rules</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                <FaUsers size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-300">
                                                    Teams must have between <span className="font-bold text-white">{hackathon.minTeamSize}</span> and <span className="font-bold text-white">{hackathon.maxTeamSize}</span> members.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
