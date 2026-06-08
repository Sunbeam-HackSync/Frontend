import { useWorkspaceData } from "../utils";

import PageHeader from "../components/PageHeader";

import StatCard from "../components/StatCard";

import { FaUsers, FaHandsHelping, FaCode, FaClipboardCheck } from "react-icons/fa";

import { formatDateTime } from "../../../utils/formatters";

import Panel from "../components/Panel";

export function WorkspaceOverviewPage() {
  const {
    role,
    hackathon,
    registrations,
    teams,
    submissions,
    tickets,
    announcements,
  } = useWorkspaceData();

  return (
    <>
      <PageHeader
        eyebrow={`${role || "Member"} Workspace`}
        title={`${hackathon.title} Overview`}
        description="Role-aware command center with the most important hackathon activity and next actions."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Registrations"
          value={registrations.length}
          helper="Applications received"
          icon={FaUsers}
        />
        <StatCard
          label="Teams"
          value={teams.length}
          helper="Formed inside this hackathon"
          icon={FaHandsHelping}
        />
        <StatCard
          label="Submissions"
          value={submissions.length}
          helper="Drafted or submitted projects"
          icon={FaCode}
        />
        <StatCard
          label="Help Tickets"
          value={tickets.length}
          helper="Open, claimed, and resolved"
          icon={FaClipboardCheck}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Event Configuration">
          <div className="grid gap-3 text-sm md:grid-cols-2">
            {[
              ["Status", hackathon.status],
              ["Prize Pool", hackathon.prizePool],
              ["Team Size", `${hackathon.minTeamSize}-${hackathon.maxTeamSize}`],
              ["Timezone", hackathon.timezone],
              ["Registration Ends", formatDateTime(hackathon.registrationEnd)],
              ["Submission Ends", formatDateTime(hackathon.submissionEnd)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <p className="text-slate-500">{label}</p>
                <p className="mt-1 font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Latest Announcements">
          <div className="space-y-3">
            {announcements.slice(0, 4).map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <p className="font-semibold text-white">{announcement.title}</p>
                <p className="mt-1 text-sm text-slate-400">{announcement.message}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
