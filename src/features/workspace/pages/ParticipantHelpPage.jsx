import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useOutletContext } from "react-router";
import { useSelector } from "react-redux";

import { createHelpTicket } from "../services/workspaceService";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Button from "../../../components/ui/Button";
import Badge from "../components/Badge";

export function ParticipantHelpPage() {
  const { id: hackathonId } = useParams();
  const { hackathon } = useOutletContext();
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techTags, setTechTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // NOTE: We don't have a GET endpoint for tickets in the spec yet.
  // Submitted tickets are shown optimistically from local state.

  async function submitTicket(event) {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !techTags.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      // The API requires a teamId. For now we pass null and let the backend handle it.
      // When a GET /participants/hackathons/{id}/myTeam endpoint is available, we fetch the teamId first.
      const newTicket = await createHelpTicket({
        teamId: null,         // Will be linked to team on backend via JWT user context
        issueTitle: title.trim(),
        issueDescription: description.trim(),
        techTags: techTags.trim(),
      });

      setMyTickets((prev) => [newTicket, ...prev]);
      setTitle("");
      setDescription("");
      setTechTags("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const STATUS_STYLES = {
    OPEN: "border-sky-500/30 bg-sky-500/5",
    CLAIMED: "border-amber-500/30 bg-amber-500/5",
    RESOLVED: "border-emerald-500/30 bg-emerald-500/5",
    CLOSED_UNRESOLVED: "border-slate-700 bg-slate-900",
  };

  return (
    <>
      <PageHeader
        eyebrow="Participant"
        title="Help Tickets"
        description="Raise a blocker with a mentor. Describe your issue clearly so they can help you fast."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Submit Form */}
        <Panel title="Request Mentor Help">
          <form onSubmit={submitTicket} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Issue Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Getting 500 error on login endpoint"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Tech Tags *</label>
              <input
                value={techTags}
                onChange={(e) => setTechTags(e.target.value)}
                placeholder="e.g. React, Spring Boot, JWT, MySQL"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Describe the Blocker *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you try? What is the exact error? What do you expect to happen?"
                rows={5}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
                required
              />
            </div>

            {submitError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                ✓ Ticket submitted! A mentor will claim it shortly.
              </div>
            )}

            <Button disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "🚩 Raise Ticket"}
            </Button>
          </form>
        </Panel>

        {/* Ticket Status Board */}
        <Panel title="My Ticket Status">
          <div className="space-y-3">
            {myTickets.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-center">
                <p className="text-slate-400 text-sm">No tickets raised yet.</p>
                <p className="text-slate-500 text-xs mt-1">Use the form to request mentor help.</p>
              </div>
            ) : (
              myTickets.map((ticket, index) => (
                <div
                  key={ticket.id || index}
                  className={`rounded-lg border p-4 ${STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{ticket.issueTitle}</h3>
                      <p className="mt-1 text-xs text-slate-500">{ticket.techTags}</p>
                    </div>
                    <Badge>{ticket.status || "OPEN"}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{ticket.issueDescription}</p>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}