import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { getHackathonSubmissions } from "../../host/services/hostService";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Badge from "../components/Badge";

export function OrganizerSubmissionsPage() {
  const { id } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubmissions() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getHackathonSubmissions(id);
        // data should be an array of submissions
        setSubmissions(data || []);
      } catch (err) {
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, [id]);

  if (loading) {
    return <div className="py-10 text-slate-400">Loading submissions...</div>;
  }

  if (error) {
    return <div className="py-10 text-red-400">{error}</div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Submissions and Leaderboard"
        description="Inspect submitted projects, linked teams, judging coverage, and current leaderboard totals."
      />

      <div className="space-y-5">
        {submissions.length === 0 ? (
          <p className="text-slate-400">No submissions found.</p>
        ) : (
          submissions.map((submission) => {
            return (
              <Panel
                key={submission.submissionId || Math.random()}
                title={submission.projectName || "Untitled Project"}
                description={submission.description || "No description provided"}
                actions={<Badge>{submission.status || "SUBMITTED"}</Badge>}
              >
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-500">Team</p>
                    <p className="mt-1 text-lg font-bold text-white">{submission.teamName || "Unknown Team"}</p>
                    {/* API might not return members in Submission dto, keep minimal */}
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-500">Project Link</p>
                    <p className="mt-1 text-lg font-bold text-sky-400">
                      {submission.projectUrl ? (
                        <a href={submission.projectUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          View Repository
                        </a>
                      ) : "No link provided"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-500">Current Score</p>
                    <p className="mt-1 text-3xl font-bold text-white">
                      {submission.score || 0}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">Total accumulated score</p>
                  </div>
                </div>
              </Panel>
            );
          })
        )}
      </div>
    </>
  );
}