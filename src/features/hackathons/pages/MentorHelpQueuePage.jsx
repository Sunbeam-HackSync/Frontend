// /src/features/hackathons/pages/MentorHelpQueuePage.jsx

import { useWorkspaceData } from "../utils";

import { claimHelpTicket } from "../../../services/demoStore";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";

import Badge from "../components/Badge";

import Button from "../../../components/ui/Button";

export function MentorHelpQueuePage() {
  const { tickets, teams, user, commit } = useWorkspaceData();

  const columns = [
    ["OPEN", "Open"],
    ["CLAIMED", "Claimed"],
    ["RESOLVED", "Resolved"],
  ];

  return (
    <>
      <PageHeader
        eyebrow="Mentor"
        title="Help Queue"
        description="Claim participant blockers, generate a meeting link, and resolve tickets after support."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {columns.map(([status, label]) => (
          <Panel key={status} title={label}>
            <div className="space-y-3">
              {tickets
                .filter((ticket) => ticket.status === status)
                .map((ticket) => {
                  const team = teams.find((item) => item.id === ticket.teamId);

                  return (
                    <div
                      key={ticket.id}
                      className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <Badge>{ticket.priority}</Badge>
                        <Badge>{ticket.status}</Badge>
                      </div>
                      <h3 className="font-bold text-white">{ticket.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">Team: {team?.name}</p>
                      <p className="mt-3 text-sm text-slate-400">{ticket.description}</p>
                      {ticket.meetingUrl && (
                        <p className="mt-3 break-all text-sm text-sky-300">
                          {ticket.meetingUrl}
                        </p>
                      )}
                      <div className="mt-4 flex gap-2">
                        {ticket.status === "OPEN" && (
                          <Button
                            className="w-full px-3"
                            onClick={() =>
                              commit((draft) => claimHelpTicket(draft, ticket.id, user.id))
                            }
                          >
                            Claim
                          </Button>
                        )}
                        {ticket.status === "CLAIMED" && ticket.mentorId === user.id && (
                          <Button
                            className="w-full px-3"
                            variant="secondary"
                            onClick={() =>
                              commit((draft) => {
                                const currentTicket = draft.helpTickets.find(
                                  (item) => item.id === ticket.id,
                                );
                                if (currentTicket) {
                                  currentTicket.status = "RESOLVED";
                                  currentTicket.resolvedAt = new Date().toISOString();
                                }
                                return draft;
                              })
                            }
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}