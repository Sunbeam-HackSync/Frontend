import { useMemo, useState } from "react";

import {
  FaBullhorn,
  FaClipboardCheck,
  FaCode,
  FaHandsHelping,
  FaUsers,
} from "react-icons/fa";
import { Link, useOutletContext } from "react-router";
import { useSelector } from "react-redux";

import Badge from "../../components/dashboard/Badge";
import PageHeader from "../../components/dashboard/PageHeader";
import Panel from "../../components/dashboard/Panel";
import StatCard from "../../components/dashboard/StatCard";
import Button from "../../components/ui/Button";
import useDemoData from "../../hooks/useDemoData";
import {
  claimHelpTicket,
  createAnnouncement,
  createHelpTicket,
  createSubmission,
  createTeam,
  saveScores,
  updateRegistrationStatus,
} from "../../services/demoStore";
import { formatDateTime, getInitials, isPast } from "../../utils/formatters";

function useWorkspaceData() {
  const context = useOutletContext();
  const { state, commit } = useDemoData();
  const { user } = useSelector((reduxState) => reduxState.auth);
  const hackathon = context?.hackathon;
  const role = context?.role;

  const scoped = useMemo(() => {
    const registrations = state.registrations.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const teams = state.teams.filter((item) => item.hackathonId === hackathon?.id);
    const teamMembers = state.teamMembers.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const submissions = state.submissions.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const tickets = state.helpTickets.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const announcements = state.announcements.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const rubrics = state.rubrics
      .filter((item) => item.hackathonId === hackathon?.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
      registrations,
      teams,
      teamMembers,
      submissions,
      tickets,
      announcements,
      rubrics,
    };
  }, [hackathon?.id, state]);

  function findUser(userId) {
    return state.users.find((item) => item.id === userId);
  }

  function findTeam(teamId) {
    return state.teams.find((item) => item.id === teamId);
  }

  return {
    ...context,
    state,
    commit,
    user,
    role,
    hackathon,
    ...scoped,
    findUser,
    findTeam,
  };
}

function PersonRow({ user, helper }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sm font-bold text-sky-200">
        {getInitials(user?.fullName)}
      </div>
      <div>
        <p className="font-semibold text-white">{user?.fullName || "Unknown User"}</p>
        <p className="text-sm text-slate-500">{helper || user?.email}</p>
      </div>
    </div>
  );
}

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

export function OrganizerParticipantsPage() {
  const { registrations, findUser, commit, user } = useWorkspaceData();

  function setRegistrationStatus(registrationId, status) {
    commit((draft) =>
      updateRegistrationStatus(
        draft,
        registrationId,
        status,
        user.id,
        status === "REJECTED" ? "Profile needs stronger project details." : "",
      ),
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Application Management"
        description="Review participant applications and move them through pending, approved, rejected, or waitlisted states."
      />

      <Panel title="Registrations">
        <div className="space-y-3">
          {registrations.map((registration) => {
            const applicant = findUser(registration.userId);

            return (
              <div
                key={registration.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <PersonRow
                  user={applicant}
                  helper={`Applied ${formatDateTime(registration.appliedAt)}`}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{registration.status}</Badge>
                  <Button
                    className="px-3"
                    onClick={() => setRegistrationStatus(registration.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    className="px-3"
                    variant="secondary"
                    onClick={() => setRegistrationStatus(registration.id, "WAITLISTED")}
                  >
                    Waitlist
                  </Button>
                  <Button
                    className="px-3"
                    variant="outline"
                    onClick={() => setRegistrationStatus(registration.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

export function OrganizerSubmissionsPage() {
  const { submissions, state, findTeam, findUser, teamMembers, rubrics } =
    useWorkspaceData();

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Submissions and Leaderboard"
        description="Inspect submitted projects, linked teams, judging coverage, and current leaderboard totals."
      />

      <div className="space-y-5">
        {submissions.map((submission) => {
          const team = findTeam(submission.teamId);
          const members = teamMembers
            .filter((member) => member.teamId === team?.id)
            .map((member) => findUser(member.userId));
          const assignment = state.judgeAssignments.find(
            (item) => item.submissionId === submission.id,
          );
          const scores = state.scores.filter(
            (score) => score.assignmentId === assignment?.id,
          );
          const total = scores.reduce((sum, score) => sum + Number(score.scoreGiven), 0);

          return (
            <Panel
              key={submission.id}
              title={submission.title}
              description={submission.description}
              actions={<Badge>{submission.status}</Badge>}
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-500">Team</p>
                  <p className="mt-1 text-lg font-bold text-white">{team?.name}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {members.map((member) => member?.fullName).join(", ")}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-500">Judge Status</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {assignment?.status.replaceAll("_", " ") || "Not assigned"}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {submission.repositoryUrl}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-500">Current Score</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {total}/{rubrics.reduce((sum, rubric) => sum + rubric.maxScore, 0)}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">Based on saved rubrics</p>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}

export function OrganizerAnnouncementsPage() {
  const { hackathon, announcements, commit, user } = useWorkspaceData();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function submitAnnouncement(event) {
    event.preventDefault();
    if (!title.trim() || !message.trim()) return;

    commit((draft) =>
      createAnnouncement(draft, hackathon.id, user.id, title.trim(), message.trim()),
    );
    setTitle("");
    setMessage("");
  }

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Communication Hub"
        description="Publish in-app announcements that participants, judges, and mentors can read immediately."
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Broadcast Announcement">
          <form onSubmit={submitAnnouncement} className="space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Announcement title"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message for all attendees"
              className="min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
            <Button className="w-full">Publish</Button>
          </form>
        </Panel>

        <Panel title="Announcement History">
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <FaBullhorn className="text-sky-300" />
                  <h3 className="font-bold text-white">{announcement.title}</h3>
                </div>
                <p className="text-sm text-slate-400">{announcement.message}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {formatDateTime(announcement.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

export function ParticipantTeamPage() {
  const { hackathon, teams, teamMembers, findUser, user, commit } = useWorkspaceData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const myMembership = teamMembers.find((member) => member.userId === user.id);
  const myTeam = teams.find((team) => team.id === myMembership?.teamId);

  function submitTeam(event) {
    event.preventDefault();
    if (!name.trim()) return;

    commit((draft) =>
      createTeam(draft, hackathon.id, user.id, name.trim(), description.trim()),
    );
    setName("");
    setDescription("");
  }

  return (
    <>
      <PageHeader
        eyebrow="Participant"
        title="Team Workspace"
        description="Create a team, share an invite code, and browse teams looking for teammates."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel title={myTeam ? "My Team" : "Create Team"}>
          {myTeam ? (
            <div>
              <Badge>{myTeam.status}</Badge>
              <h2 className="mt-4 text-2xl font-bold text-white">{myTeam.name}</h2>
              <p className="mt-2 text-slate-400">{myTeam.description}</p>
              <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-500">Invite Code</p>
                <p className="mt-1 text-xl font-bold text-sky-200">{myTeam.inviteCode}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submitTeam} className="space-y-4">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Team name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What are you building?"
                className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              />
              <Button className="w-full">Create Team</Button>
            </form>
          )}
        </Panel>

        <Panel title="Looking for Teammates">
          <div className="space-y-3">
            {teams.map((team) => {
              const members = teamMembers
                .filter((member) => member.teamId === team.id)
                .map((member) => findUser(member.userId));

              return (
                <div
                  key={team.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">{team.name}</h3>
                    <Badge>{team.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{team.description}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    Members: {members.map((member) => member?.fullName).join(", ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {team.lookingFor.map((skill) => (
                      <Badge key={skill} tone="blue">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </>
  );
}

export function ParticipantSubmissionPage() {
  const { hackathon, submissions, teamMembers, teams, user, commit } = useWorkspaceData();
  const myMembership = teamMembers.find((member) => member.userId === user.id);
  const myTeam = teams.find((team) => team.id === myMembership?.teamId);
  const existingSubmission = submissions.find((item) => item.teamId === myTeam?.id);
  const [form, setForm] = useState({
    title: existingSubmission?.title || "",
    description: existingSubmission?.description || "",
    repositoryUrl: existingSubmission?.repositoryUrl || "",
    demoVideoUrl: existingSubmission?.demoVideoUrl || "",
    presentationUrl: existingSubmission?.presentationUrl || "",
    techStack: existingSubmission?.techStack?.join(", ") || "",
  });
  const closed = isPast(hackathon.submissionEnd);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitProject(event) {
    event.preventDefault();
    if (!myTeam || closed || !form.repositoryUrl.startsWith("https://")) return;

    commit((draft) => createSubmission(draft, hackathon.id, myTeam.id, form));
  }

  return (
    <>
      <PageHeader
        eyebrow="Participant"
        title="Submission Portal"
        description="Submit repository, demo video, deck, description, and tech stack before the deadline."
      />

      <Panel
        title={myTeam ? `Project for ${myTeam.name}` : "Create a team first"}
        description={`Deadline: ${formatDateTime(hackathon.submissionEnd)}`}
        actions={existingSubmission && <Badge>{existingSubmission.status}</Badge>}
      >
        <form onSubmit={submitProject} className="grid gap-4">
          {[
            ["title", "Project title"],
            ["repositoryUrl", "Repository URL https://..."],
            ["demoVideoUrl", "Demo video URL"],
            ["presentationUrl", "Presentation URL"],
            ["techStack", "Tech stack comma separated"],
          ].map(([field, placeholder]) => (
            <input
              key={field}
              value={form[field]}
              onChange={(event) => updateField(field, event.target.value)}
              placeholder={placeholder}
              disabled={!myTeam || closed}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
          ))}

          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Project description"
            disabled={!myTeam || closed}
            className="min-h-36 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <Button disabled={!myTeam || closed} className="w-full">
            {closed ? "Submission Closed" : existingSubmission ? "Update Submission" : "Submit Project"}
          </Button>
        </form>
      </Panel>
    </>
  );
}

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

export function JudgeAssignedProjectsPage() {
  const { state, user, findTeam } = useWorkspaceData();
  const assignments = state.judgeAssignments.filter(
    (assignment) => assignment.judgeId === user.id,
  );

  return (
    <>
      <PageHeader
        eyebrow="Judge"
        title="Assigned Project Queue"
        description="Review only the projects explicitly assigned to this judge account."
      />

      <div className="grid gap-5">
        {assignments.map((assignment) => {
          const submission = state.submissions.find(
            (item) => item.id === assignment.submissionId,
          );
          const team = findTeam(submission?.teamId);

          return (
            <Panel
              key={assignment.id}
              title={submission?.title}
              description={submission?.description}
              actions={<Badge>{assignment.status}</Badge>}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Team: {team?.name}</p>
                  <p className="mt-2 text-sm text-sky-300">{submission?.repositoryUrl}</p>
                </div>
                <Link to="../evaluation">
                  <Button>Evaluate</Button>
                </Link>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}

export function JudgeEvaluationPage() {
  const { state, rubrics, user, commit } = useWorkspaceData();
  const [blindMode, setBlindMode] = useState(false);
  const assignment = state.judgeAssignments.find(
    (item) => item.judgeId === user.id && item.status !== "COMPLETED",
  ) || state.judgeAssignments.find((item) => item.judgeId === user.id);
  const submission = state.submissions.find((item) => item.id === assignment?.submissionId);
  const team = state.teams.find((item) => item.id === submission?.teamId);
  const [conflict, setConflict] = useState(Boolean(assignment?.conflict));
  const [scores, setScores] = useState(() =>
    rubrics.map((rubric) => {
      const existing = state.scores.find(
        (score) => score.assignmentId === assignment?.id && score.rubricId === rubric.id,
      );

      return {
        rubricId: rubric.id,
        scoreGiven: existing?.scoreGiven || 0,
        comment: existing?.comment || "",
      };
    }),
  );

  function updateScore(rubricId, field, value) {
    setScores((current) =>
      current.map((score) =>
        score.rubricId === rubricId ? { ...score, [field]: value } : score,
      ),
    );
  }

  function submitScores(event) {
    event.preventDefault();
    if (!assignment) return;

    commit((draft) => saveScores(draft, assignment.id, scores, conflict));
  }

  return (
    <>
      <PageHeader
        eyebrow="Judge"
        title="Evaluation Rubric"
        description="Score assigned projects using standardized criteria and optionally enable blind review."
        actions={
          <button
            type="button"
            onClick={() => setBlindMode((value) => !value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            {blindMode ? "Blind Review On" : "Blind Review Off"}
          </button>
        }
      />

      <Panel
        title={submission?.title || "No assigned submission"}
        description={blindMode ? "Team identity hidden for blind review." : `Team: ${team?.name}`}
        actions={assignment && <Badge>{assignment.status}</Badge>}
      >
        <form onSubmit={submitScores} className="space-y-5">
          <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={conflict}
              onChange={(event) => setConflict(event.target.checked)}
            />
            Flag conflict of interest for this project
          </label>

          {rubrics.map((rubric) => {
            const score = scores.find((item) => item.rubricId === rubric.id);

            return (
              <div
                key={rubric.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{rubric.title}</h3>
                    <p className="text-sm text-slate-500">{rubric.description}</p>
                  </div>
                  <Badge tone="blue">
                    {score?.scoreGiven}/{rubric.maxScore}
                  </Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max={rubric.maxScore}
                  value={score?.scoreGiven || 0}
                  onChange={(event) =>
                    updateScore(rubric.id, "scoreGiven", Number(event.target.value))
                  }
                  className="w-full"
                />
                <textarea
                  value={score?.comment || ""}
                  onChange={(event) =>
                    updateScore(rubric.id, "comment", event.target.value)
                  }
                  placeholder="Judge comment"
                  className="mt-3 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
                />
              </div>
            );
          })}

          <Button className="w-full">Save Evaluation</Button>
        </form>
      </Panel>
    </>
  );
}

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
