import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import Badge from "../../features/workspace/components/Badge";
import Panel from "../../features/workspace/components/Panel";
import StatCard from "../../features/workspace/components/StatCard";
import Button from "../../components/ui/Button";
import Container from "../../components/common/Container";
import { formatDateTime } from "../../utils/formatters";
import { getParticipantHackathonById } from "../../features/workspace/services/workspaceService";

export default function HackathonDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, platformRoles } = useSelector((state) => state.auth);
  
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHackathon() {
      try {
        setLoading(true);
        const data = await getParticipantHackathonById(id);
        setHackathon(data);
      } catch (err) {
        setError("Failed to load hackathon details.");
      } finally {
        setLoading(false);
      }
    }
    fetchHackathon();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <p className="text-slate-400">Loading details...</p>
      </Container>
    );
  }

  if (error || !hackathon) {
    return (
      <Container className="py-20">
        <Panel title="Hackathon not found">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/hackathons">
            <Button>Back to Hackathons</Button>
          </Link>
        </Panel>
      </Container>
    );
  }

  // Determine the correct CTA based on role
  function getWorkspaceLink() {
    if (!isAuthenticated) return null;
    if (platformRoles?.includes("PARTICIPANT")) return `/workspace/${hackathon.id}/team`;
    return `/workspace/${hackathon.id}/overview`;
  }

  const deadlinePassed = hackathon.registrationEnd ? new Date(hackathon.registrationEnd) < new Date() : false;
  const workspaceLink = getWorkspaceLink();

  return (
    <section className="py-14">
      <Container>
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Badge>{hackathon.hackathonStatus || "UNKNOWN"}</Badge>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {hackathon.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                {hackathon.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {hackathon.tracks?.map((track) => (
                  <Badge key={track} tone="blue">
                    {track}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Prize Pool</p>
              <p className="mt-2 text-3xl font-bold text-white">{hackathon.prizePool || "TBA"}</p>
              <p className="mt-4 text-sm text-slate-400">
                Team size: {hackathon.minTeamSize}-{hackathon.maxTeamSize}
              </p>

              {workspaceLink ? (
                <Link to={workspaceLink} className="mt-5 block">
                  <Button className="w-full">
                    {platformRoles?.includes("PARTICIPANT") ? "Join / Manage Team →" : "Open Workspace"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    className="mt-5 w-full"
                    disabled={deadlinePassed}
                    onClick={() => navigate("/login")}
                  >
                    {deadlinePassed ? "Registration Closed" : "Login to Participate"}
                  </Button>
                  {!deadlinePassed && (
                    <p className="mt-2 text-center text-xs text-slate-500">Login as a Participant to join</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Registration Window"
            value={hackathon.registrationEnd ? formatDateTime(hackathon.registrationEnd) : "N/A"}
            helper="Applications close at this timestamp"
            icon={FaCalendarAlt}
          />
          <StatCard
            label="Submission Deadline"
            value={hackathon.submissionEnd ? formatDateTime(hackathon.submissionEnd) : "N/A"}
            helper="Participants cannot submit after this"
            icon={FaClock}
          />
          <StatCard
            label="Max Participants"
            value={hackathon.maxParticipants || "Unlimited"}
            helper="Capacity configured by organizer"
            icon={FaUsers}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {hackathon.rules && hackathon.rules.length > 0 && (
            <Panel title="Rules">
              <div className="space-y-3">
                {hackathon.rules.map((rule) => (
                  <div
                    key={rule}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                  >
                    {rule}
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Timeline">
            <div className="space-y-3 text-sm">
              {[
                ["Registration Starts", hackathon.registrationStart],
                ["Registration Ends", hackathon.registrationEnd],
                ["Submission Starts", hackathon.submissionStart],
                ["Submission Ends", hackathon.submissionEnd],
                ["Judging Starts", hackathon.judgingStart],
                ["Judging Ends", hackathon.judgingEnd],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-300"
                >
                  <span className="text-slate-500">{label}</span>
                  <span>{value ? formatDateTime(value) : "N/A"}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Container>
    </section>
  );
}
