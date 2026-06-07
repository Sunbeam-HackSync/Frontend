import { useMemo } from "react";

import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import Badge from "../../components/dashboard/Badge";
import Panel from "../../components/dashboard/Panel";
import StatCard from "../../components/dashboard/StatCard";
import Button from "../../components/ui/Button";
import Container from "../../components/common/Container";
import useDemoData from "../../hooks/useDemoData";
import {
  getHackathonRole,
  getRegistration,
  registerForHackathon,
} from "../../services/demoStore";
import { formatDateTime, isPast } from "../../utils/formatters";

export default function HackathonDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { state, commit } = useDemoData();

  const hackathon = state.hackathons.find((item) => item.slug === slug);

  const registration = useMemo(() => {
    if (!hackathon || !user) return null;
    return getRegistration(state, hackathon.id, user.id);
  }, [hackathon, state, user]);

  const role = useMemo(() => {
    if (!hackathon || !user) return null;
    return getHackathonRole(state, hackathon.id, user.id);
  }, [hackathon, state, user]);

  if (!hackathon) {
    return (
      <Container className="py-20">
        <Panel title="Hackathon not found">
          <Link to="/hackathons">
            <Button>Back to Hackathons</Button>
          </Link>
        </Panel>
      </Container>
    );
  }

  function handleRegister() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    commit((draft) => registerForHackathon(draft, hackathon.id, user.id));
  }

  const deadlinePassed = isPast(hackathon.registrationEnd);

  return (
    <section className="py-14">
      <Container>
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Badge>{hackathon.status}</Badge>
            <Badge tone="slate">{hackathon.mode}</Badge>
            {registration && <Badge>{registration.status}</Badge>}
            {role && <Badge tone="purple">{role}</Badge>}
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
                {hackathon.tracks.map((track) => (
                  <Badge key={track} tone="blue">
                    {track}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Prize Pool</p>
              <p className="mt-2 text-3xl font-bold text-white">{hackathon.prizePool}</p>
              <p className="mt-4 text-sm text-slate-400">
                Team size: {hackathon.minTeamSize}-{hackathon.maxTeamSize}
              </p>

              {role ? (
                <Link to={`/workspace/${hackathon.slug}/overview`} className="mt-5 block">
                  <Button className="w-full">Open Workspace</Button>
                </Link>
              ) : (
                <Button
                  className="mt-5 w-full"
                  disabled={!!registration || deadlinePassed}
                  onClick={handleRegister}
                >
                  {registration
                    ? `Registration ${registration.status.toLowerCase()}`
                    : deadlinePassed
                      ? "Registration Closed"
                      : "Register Now"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Registration Window"
            value={formatDateTime(hackathon.registrationEnd)}
            helper="Applications close at this timestamp"
            icon={FaCalendarAlt}
          />
          <StatCard
            label="Submission Deadline"
            value={formatDateTime(hackathon.submissionEnd)}
            helper="Participants cannot submit after this"
            icon={FaClock}
          />
          <StatCard
            label="Max Participants"
            value={hackathon.maxParticipants}
            helper="Capacity configured by organizer"
            icon={FaUsers}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
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
                  <span>{formatDateTime(value)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Container>
    </section>
  );
}
