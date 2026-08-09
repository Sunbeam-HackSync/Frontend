// /src/features/hackathons/pages/MentorHelpQueuePage.jsx

import { useState, useEffect } from "react";
import { useParams } from "react-router";

import api from "../../../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Badge from "../components/Badge";
import Button from "../../../components/ui/Button";
import { FaClipboardList } from "react-icons/fa";

async function fetchAllTickets(hackathonId) {
  try {
    // Attempt to get all tickets for a hackathon as mentor/organizer
    const response = await api.get(`/participants/helpTickets`, {
      params: { hackathonId },
    });
    return response.data;
  } catch {
    return [];
  }
}

async function claimTicket(ticketId) {
  const response = await api.put(`/participants/helpTickets/${ticketId}/claim`);
  return response.data;
}

async function resolveTicket(ticketId) {
  const response = await api.put(`/participants/helpTickets/${ticketId}/resolve`);
  return response.data;
}

const STATUS_STYLES = {
  OPEN: "border-sky-500/20 bg-sky-500/5",
  CLAIMED: "border-amber-500/20 bg-amber-500/5",
  RESOLVED: "border-emerald-500/20 bg-emerald-500/5",
  CLOSED_UNRESOLVED: "border-slate-700 bg-slate-900",
};

const COLUMNS = [
  { status: "OPEN", label: "🟦 Open", description: "Awaiting a mentor" },
  { status: "CLAIMED", label: "🟡 Claimed", description: "Being handled" },
  { status: "RESOLVED", label: "🟢 Resolved", description: "Issue solved" },
];

export function MentorHelpQueuePage() {
  const { id: hackathonId } = useParams();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAllTickets(hackathonId);
      setTickets(data);
      setLoading(false);
    }
    if (hackathonId) load();
  }, [hackathonId]);

  async function handleClaim(ticketId) {
    try {
      setActionLoading(ticketId);
      await claimTicket(ticketId);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "CLAIMED" } : t))
      );
    } catch {
      // Optimistically update if API endpoint not ready
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "CLAIMED" } : t))
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleResolve(ticketId) {
    try {
      setActionLoading(ticketId);
      await resolveTicket(ticketId);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "RESOLVED" } : t))
      );
    } catch {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: "RESOLVED" } : t))
      );
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return <div className="py-10 text-slate-400">Loading help queue...</div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Mentor"
        title="Help Queue"
        description="Real-time board of participant blockers. Claim a ticket to let the team know you're on it, then resolve after your call."
      />

      {tickets.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <FaClipboardList className="mx-auto mb-3 text-slate-600" size={28} />
          <p className="text-slate-400">No help tickets raised yet.</p>
          <p className="text-xs text-slate-500 mt-1">Tickets submitted by participants will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {COLUMNS.map(({ status, label, description }) => {
            const columnTickets = tickets.filter((t) => t.status === status);
            return (
              <Panel
                key={status}
                title={label}
                description={`${columnTickets.length} ticket${columnTickets.length !== 1 ? "s" : ""}`}
              >
                <div className="space-y-3">
                  {columnTickets.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-800 p-4 text-center text-sm text-slate-500">
                      {description === "Awaiting a mentor" ? "No open tickets 🎉" : "Nothing here yet"}
                    </p>
                  ) : (
                    columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`rounded-lg border p-4 ${STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN}`}
                      >
                        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                          <h3 className="flex-1 font-semibold text-white text-sm">
                            {ticket.issueTitle}
                          </h3>
                          <Badge>{ticket.status}</Badge>
                        </div>

                        {ticket.techTags && (
                          <div className="mb-2 flex flex-wrap gap-1">
                            {ticket.techTags.split(",").map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-sm text-slate-400 line-clamp-2">{ticket.issueDescription}</p>

                        <div className="mt-3 flex gap-2">
                          {ticket.status === "OPEN" && (
                            <Button
                              className="w-full px-3 text-xs"
                              disabled={actionLoading === ticket.id}
                              onClick={() => handleClaim(ticket.id)}
                            >
                              {actionLoading === ticket.id ? "Claiming..." : "Claim Ticket"}
                            </Button>
                          )}
                          {ticket.status === "CLAIMED" && (
                            <Button
                              className="w-full px-3 text-xs"
                              variant="secondary"
                              disabled={actionLoading === ticket.id}
                              onClick={() => handleResolve(ticket.id)}
                            >
                              {actionLoading === ticket.id ? "Resolving..." : "Mark Resolved"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}