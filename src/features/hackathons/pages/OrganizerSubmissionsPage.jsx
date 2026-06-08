import { useWorkspaceData } from "../utils";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";

import Badge from "../components/Badge";


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