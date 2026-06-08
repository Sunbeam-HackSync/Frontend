import { useMemo, useState } from "react";

import { FaChartLine, FaShieldAlt, FaTrophy, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";

import Badge from "../../features/hackathons/components/Badge";
import PageHeader from "../../features/hackathons/components/PageHeader";
import Panel from "../../features/hackathons/components/Panel";
import StatCard from "../../features/hackathons/components/StatCard";
import Button from "../../components/ui/Button";
import useDemoData from "../../hooks/useDemoData";
import { updateHackathonStatus } from "../../services/demoStore";
import { formatDateTime } from "../../utils/formatters";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { state, commit } = useDemoData();
  const [reviewReason, setReviewReason] = useState("");

  const metrics = useMemo(() => {
    return {
      activeHackathons: state.hackathons.filter((item) =>
        ["LIVE", "APPROVED"].includes(item.status),
      ).length,
      pendingHackathons: state.hackathons.filter(
        (item) => item.status === "PENDING_APPROVAL",
      ).length,
      users: state.users.length,
      submissions: state.submissions.length,
    };
  }, [state]);

  function changeStatus(hackathonId, status, reason = "") {
    commit((draft) => updateHackathonStatus(draft, hackathonId, status, user.id, reason));
    setReviewReason("");
  }

  return (
    <section className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Platform Command Center"
        description="Monitor platform activity, review organizer-submitted hackathons, and act on events that need moderation."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Hackathons"
          value={metrics.activeHackathons}
          helper="Live or approved for discovery"
          icon={FaTrophy}
        />
        <StatCard
          label="Pending Review"
          value={metrics.pendingHackathons}
          helper="Needs platform approval"
          icon={FaShieldAlt}
        />
        <StatCard
          label="Registered Users"
          value={metrics.users}
          helper="Demo users and signups"
          icon={FaUsers}
        />
        <StatCard
          label="Projects Submitted"
          value={metrics.submissions}
          helper="Platform-wide submissions"
          icon={FaChartLine}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Panel
          title="Hackathon Review Pipeline"
          description="Approve quality events, reject incomplete ones with a reason, or suspend unsafe events."
        >
          <div className="space-y-4">
            {state.hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge>{hackathon.status}</Badge>
                      <Badge tone="slate">{hackathon.mode}</Badge>
                    </div>

                    <h3 className="text-xl font-bold text-white">{hackathon.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                      {hackathon.shortDescription}
                    </p>

                    {hackathon.reviewReason && (
                      <p className="mt-3 text-sm text-amber-300">
                        Review note: {hackathon.reviewReason}
                      </p>
                    )}
                  </div>

                  <div className="flex min-w-72 flex-col gap-3">
                    <textarea
                      value={reviewReason}
                      onChange={(event) => setReviewReason(event.target.value)}
                      placeholder="Reason for rejection or suspension"
                      className="min-h-20 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        className="px-3"
                        onClick={() => changeStatus(hackathon.id, "APPROVED")}
                      >
                        Approve
                      </Button>
                      <Button
                        className="px-3"
                        variant="secondary"
                        onClick={() =>
                          changeStatus(
                            hackathon.id,
                            "REJECTED",
                            reviewReason || "Event requires more complete details.",
                          )
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        className="px-3"
                        variant="outline"
                        onClick={() =>
                          changeStatus(
                            hackathon.id,
                            "SUSPENDED",
                            reviewReason || "Suspended for platform review.",
                          )
                        }
                      >
                        Suspend
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Platform Health">
            <div className="space-y-3 text-sm">
              {[
                ["API Gateway", "Healthy", "green"],
                ["Notification Queue", "Normal", "blue"],
                ["Storage Usage", "42%", "yellow"],
                ["Abuse Reports", "0 Open", "green"],
              ].map(([label, value, tone]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3"
                >
                  <span className="text-slate-400">{label}</span>
                  <Badge tone={tone}>{value}</Badge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent Activity">
            <div className="space-y-3">
              {state.auditLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {log.action.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(log.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
