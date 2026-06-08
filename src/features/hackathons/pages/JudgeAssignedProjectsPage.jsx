import { Link } from "react-router";

import PageHeader from "../components/PageHeader";

import { useWorkspaceData } from "../utils";

import Panel from "../components/Panel";

import Badge from "../components/Badge";

import Button from "../../../components/ui/Button";

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