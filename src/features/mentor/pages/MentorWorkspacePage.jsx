import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FaArrowLeft, FaTicketAlt, FaHandSparkles, FaCheckCircle, FaVideo, FaExclamationCircle } from "react-icons/fa";
import { getTicketsByStatus, claimTicket, resolveTicket } from "../services/mentorService";
import webSocketService from "../../../services/websocketService";
import Navbar from "../../../components/layout/Navbar";
import Button from "../../../components/ui/Button";

export default function MentorWorkspacePage() {
    const { id } = useParams(); // hackathon ID
    const navigate = useNavigate();

    const [openTickets, setOpenTickets] = useState([]);
    const [claimedTickets, setClaimedTickets] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        try {
            const [open, claimed, resolved] = await Promise.all([
                getTicketsByStatus("OPEN"),
                getTicketsByStatus("CLAIMED"),
                getTicketsByStatus("RESOLVED")
            ]);
            setOpenTickets(Array.isArray(open) ? open : []);
            setClaimedTickets(Array.isArray(claimed) ? claimed : []);
            setResolvedTickets(Array.isArray(resolved) ? resolved : []);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
            // Don't toast constantly on background refetches
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        fetchTickets().finally(() => setIsLoading(false));

        // Connect to WebSocket
        webSocketService.connect(() => {
            // Subscribe to global tickets topic
            webSocketService.subscribe('/topic/tickets', () => {
                // Add a small delay to ensure backend DB transaction has committed
                setTimeout(() => {
                    fetchTickets();
                }, 500);
            });
        }, (error) => {
            console.error("WebSocket connection failed", error);
            toast.error("Real-time updates disconnected");
        });

        return () => {
            webSocketService.unsubscribe('/topic/tickets');
            webSocketService.disconnect();
        };
    }, [fetchTickets]);

    const handleClaim = async (ticketId) => {
        try {
            await claimTicket(ticketId);
            toast.success("Ticket claimed! A meeting link has been generated.");
            fetchTickets();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to claim ticket.");
        }
    };

    const handleResolve = async (ticketId) => {
        try {
            await resolveTicket(ticketId);
            toast.success("Ticket resolved successfully.");
            fetchTickets();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resolve ticket.");
        }
    };

    const openMeeting = (link) => {
        if (link) window.open(link, "_blank");
    };

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

    return (
        <>
            <Navbar hideLinks={true} />
            <div className="min-h-screen bg-slate-950 text-white flex flex-col h-screen">
                {/* Header */}
                <div className="border-b border-slate-800 bg-slate-900/50 p-4 shrink-0 flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/mentor/hackathon/${id}`)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Mentor Workspace</h1>
                        <p className="text-xs text-slate-400">Real-time help desk. Claim tickets to assist teams.</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
                    
                    {/* OPEN COLUMN */}
                    <div className="flex flex-col flex-1 min-w-[320px] rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden max-h-full">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center shrink-0">
                            <h3 className="font-bold flex items-center gap-2">
                                <FaExclamationCircle className="text-amber-400" /> Open Requests
                            </h3>
                            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                                {openTickets.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                            {openTickets.length === 0 ? (
                                <p className="text-center text-sm text-slate-500 py-8">No open requests right now.</p>
                            ) : (
                                openTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-md">
                                        <h4 className="font-bold text-white mb-2">{ticket.issueTitle}</h4>
                                        <p className="text-sm text-slate-400 line-clamp-3 mb-3">{ticket.issueDescription}</p>
                                        {ticket.techTags && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {ticket.techTags.split(',').map((tag, i) => (
                                                    <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-900 text-indigo-300 rounded border border-indigo-500/30">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <Button 
                                            className="w-full py-1.5 text-sm flex items-center justify-center gap-2"
                                            onClick={() => handleClaim(ticket.id)}
                                        >
                                            <FaHandSparkles /> Claim Ticket
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* CLAIMED COLUMN */}
                    <div className="flex flex-col flex-1 min-w-[320px] rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden max-h-full">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center shrink-0">
                            <h3 className="font-bold flex items-center gap-2">
                                <FaTicketAlt className="text-sky-400" /> My Sessions
                            </h3>
                            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                                {claimedTickets.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                            {claimedTickets.length === 0 ? (
                                <p className="text-center text-sm text-slate-500 py-8">You haven't claimed any tickets yet.</p>
                            ) : (
                                claimedTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-slate-800 rounded-xl p-4 border border-sky-500/30 shadow-lg shadow-sky-900/20 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
                                        <h4 className="font-bold text-white mb-2">{ticket.issueTitle}</h4>
                                        <p className="text-sm text-slate-400 mb-4">{ticket.issueDescription}</p>
                                        
                                        <div className="space-y-2">
                                            <Button 
                                                variant="outline"
                                                className="w-full py-1.5 text-sm flex items-center justify-center gap-2 border-sky-500/50 text-sky-400 hover:bg-sky-500"
                                                onClick={() => openMeeting(ticket.mentorMeetingLink)}
                                            >
                                                <FaVideo /> Join Meeting
                                            </Button>
                                            <Button 
                                                variant="secondary"
                                                className="w-full py-1.5 text-sm flex items-center justify-center gap-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 border-emerald-500/30"
                                                onClick={() => handleResolve(ticket.id)}
                                            >
                                                <FaCheckCircle /> Mark Resolved
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RESOLVED COLUMN */}
                    <div className="flex flex-col flex-1 min-w-[320px] rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden max-h-full opacity-70">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center shrink-0">
                            <h3 className="font-bold flex items-center gap-2 text-slate-400">
                                <FaCheckCircle className="text-emerald-500" /> Resolved
                            </h3>
                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-bold">
                                {resolvedTickets.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                            {resolvedTickets.length === 0 ? (
                                <p className="text-center text-sm text-slate-600 py-8">No resolved tickets yet.</p>
                            ) : (
                                resolvedTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                        <h4 className="font-bold text-slate-300 mb-1 line-through">{ticket.issueTitle}</h4>
                                        <p className="text-xs text-slate-500">Resolved at: {new Date(ticket.resolvedAt).toLocaleTimeString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
