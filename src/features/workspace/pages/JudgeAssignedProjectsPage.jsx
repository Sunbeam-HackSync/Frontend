import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";

import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Badge from "../components/Badge";
import Button from "../../../components/ui/Button";
import { FaGavel } from "react-icons/fa";
import { getAssignedSubmissions } from "../../judge/services/judgeService";

export function JudgeAssignedProjectsPage() {
  const { id: hackathonId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAssignedSubmissions(hackathonId);
        setAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load assignments", err);
      }
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
              actions={
                <Badge className={assignment.isEvaluated ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : ""}>
                  {assignment.isEvaluated ? "EVALUATED" : assignment.submissionStatus || "PENDING"}
                </Badge>
              }
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">
                    Team: <span className="text-white font-medium">{assignment.teamName || "Unknown"}</span>
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {assignment.githubRepoUrl && (
                      <a
                        href={assignment.githubRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-sm font-semibold text-sky-400 hover:text-sky-300 hover:underline"
                      >
                        Repository ↗
                      </a>
                    )}
                    {assignment.liveDemoUrl && (
                      <a
                        href={assignment.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                      >
                        Live Demo ↗
                      </a>
                    )}
                    {assignment.youtubeUrl && (
                      <a
                        href={assignment.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-sm font-semibold text-red-400 hover:text-red-300 hover:underline"
                      >
                        Video Pitch ↗
                      </a>
                    )}
                  </div>
                </div>
                {assignment.isEvaluated ? (
                  <Button disabled className="opacity-50 bg-slate-800 text-slate-400">Already Evaluated</Button>
                ) : (
                  <Link to="../evaluation" state={{ assignment }}>
                    <Button>Evaluate Project</Button>
                  </Link>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}