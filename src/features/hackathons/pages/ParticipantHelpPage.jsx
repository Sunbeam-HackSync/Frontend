import { useWorkspaceData } from "../utils";

import { createHelpTicket } from "../../../services/demoStore";

import { useState } from "react";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";

import Button from "../../../components/ui/Button";

import Badge from "../components/Badge";

export function ParticipantHelpPage() {
  const { hackathon, tickets, teamMembers, teams, user, commit } = useWorkspaceData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const myMembership = teamMembers.find((member) => member.userId === user.id);
  const myTeam = teams.find((team) => team.id === myMembership?.teamId);
  const myTickets = tickets.filter((ticket) => ticket.teamId === myTeam?.id);

  function submitTicket(event) {
    event.preventDefault();
    if (!myTeam || !description.trim()) return;

    commit((draft) =>
      createHelpTicket(
        draft,
        hackathon.id,
        myTeam.id,
        title.trim() || "Mentor help requested",
        description.trim(),
        priority,
      ),
    );
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
  }

  return (
    <>
      <PageHeader
        eyebrow="Participant"
        title="Help Tickets"
        description="Raise mentor support requests and track whether they are open, claimed, or resolved."
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Request Mentor Help">
          <form onSubmit={submitTicket} className="space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Issue title"
              disabled={!myTeam}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 disabled:opacity-50"
            />
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              disabled={!myTeam}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 disabled:opacity-50"
            >
              <option>HIGH</option>
              <option>MEDIUM</option>
              <option>LOW</option>
            </select>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the blocker"
              disabled={!myTeam}
              className="min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 disabled:opacity-50"
            />
            <Button disabled={!myTeam} className="w-full">
              Raise Ticket
            </Button>
          </form>
        </Panel>

        <Panel title="My Ticket Status">
          <div className="space-y-3">
            {myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-white">{ticket.title}</h3>
                  <div className="flex gap-2">
                    <Badge>{ticket.priority}</Badge>
                    <Badge>{ticket.status}</Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-400">{ticket.description}</p>
                {ticket.meetingUrl && (
                  <p className="mt-3 text-sm text-sky-300">{ticket.meetingUrl}</p>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}