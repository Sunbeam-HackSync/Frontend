import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Panel from "../components/Panel";
import Badge from "../components/Badge";

import { FaUsers, FaHandsHelping, FaCode, FaClipboardCheck } from "react-icons/fa";
import { formatDateTime } from "../../../utils/formatters";

// Assuming we have an endpoint for this, or we just render the hackathon data directly
// Since we don't have a direct dashboard summary API, we will just use the hackathon context
export function WorkspaceOverviewPage() {
  const { role, hackathon } = useOutletContext();

  return (
    <>
      <PageHeader
        eyebrow={`${role || "Member"} Workspace`}
        title={`${hackathon?.title || "Hackathon"} Overview`}
        description="Role-aware command center with the most important hackathon activity and next actions."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Status"
          value={hackathon?.status || "PENDING"}
          helper="Current event status"
          icon={FaUsers}
        />
        <StatCard
          label="Mode"
          value={hackathon?.mode || "ONLINE"}
          helper="Event delivery mode"
          icon={FaHandsHelping}
        />
        <StatCard
          label="Prize Pool"
          value={hackathon?.prizePool || "TBA"}
          helper="Total rewards"
          icon={FaCode}
        />
        <StatCard
          label="Capacity"
          value={hackathon?.maxParticipants || "Unlimited"}
          helper="Max participants allowed"
          icon={FaClipboardCheck}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Event Configuration">
          <div className="grid gap-3 text-sm md:grid-cols-2">
            {[
              ["Status", hackathon?.status],
              ["Prize Pool", hackathon?.prizePool],
              ["Team Size", `${hackathon?.minTeamSize || 1}-${hackathon?.maxTeamSize || 5}`],
              ["Timezone", hackathon?.timezone],
              ["Registration Ends", hackathon?.registrationEnd ? formatDateTime(hackathon.registrationEnd) : "N/A"],
              ["Submission Ends", hackathon?.submissionEnd ? formatDateTime(hackathon.submissionEnd) : "N/A"],
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
             <p className="text-slate-400 text-sm">No announcements yet.</p>
          </div>
        </Panel>
      </div>
    </>
  );
}
