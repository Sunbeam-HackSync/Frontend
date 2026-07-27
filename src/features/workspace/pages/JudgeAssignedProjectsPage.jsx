import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";

import api from "../../../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Badge from "../components/Badge";
import Button from "../../../components/ui/Button";
import { FaGavel } from "react-icons/fa";

async function getJudgeAssignments(hackathonId) {
  try {
    const response = await api.get(`/participants/hackathons/${hackathonId}/judge/assignments`);
    return response.data;
  } catch {
    return []; // Endpoint not available yet
  }
}

export function JudgeAssignedProjectsPage() {
  const { id: hackathonId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getJudgeAssignments(hackathonId);
      setAssignments(data);
      setLoading(false);
    }
    if (hackathonId) load();
  }, [hackathonId]);

  if (loading) {
    return <div className="py-10 text-slate-400">Loading assigned projects...</div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Judge"
        title="Assigned Project Queue"
        description="Review only the projects explicitly assigned to your account. Score each one using the evaluation rubric."
      />

      {assignments.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <FaGavel className="mx-auto mb-3 text-slate-600" size={28} />
          <p className="text-slate-400">No projects assigned to you yet.</p>
          <p className="text-xs text-slate-500 mt-1">The organizer will assign projects once teams have submitted.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {assignments.map((assignment) => (
            <Panel
              key={assignment.id || assignment.submissionId}
              title={assignment.projectTitle || assignment.title || "Untitled Project"}
              description={assignment.tagLine || assignment.description}
              actions={<Badge>{assignment.status || "PENDING"}</Badge>}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">
                    Team: <span className="text-white font-medium">{assignment.teamName || "Unknown"}</span>
                  </p>
                  {assignment.githubRepoUrl && (
                    <a
                      href={assignment.githubRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-sm text-sky-400 hover:text-sky-300 hover:underline"
                    >
                      View Repository →
                    </a>
                  )}
                </div>
                <Link to="../evaluation" state={{ assignment }}>
                  <Button>Evaluate Project</Button>
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}