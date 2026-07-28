import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";

import { getEvaluationCriteria, submitScores } from "../../judge/services/judgeService";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Button from "../../../components/ui/Button";
import { FaGavel } from "react-icons/fa";

export function JudgeEvaluationPage() {
  const { id: hackathonId } = useParams();
  const { state: routeState } = useLocation();

  // Assignment data passed from JudgeAssignedProjectsPage via router state
  const assignment = routeState?.assignment || null;

  const [criteriaList, setCriteriaList] = useState([]);
  const [loadingCriteria, setLoadingCriteria] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function loadCriteria() {
      setLoadingCriteria(true);
      try {
        const data = await getEvaluationCriteria(hackathonId);
        setCriteriaList(data || []);

        // Initialize scores state
        setScores((data || []).map(c => ({
          criteriaId: c.id,
          scoreGiven: 0,
          feedbackNotes: "",
        })));
      } catch {
        toast.error("Failed to load evaluation criteria.");
      } finally {
        setLoadingCriteria(false);
      }
    }
    if (hackathonId) {
      loadCriteria();
    }
  }, [hackathonId]);

  function updateScore(criteriaId, field, value) {
    setScores((current) =>
      current.map((score) =>
        score.criteriaId === criteriaId ? { ...score, [field]: value } : score
      )
    );
  }

  const totalScore = scores.reduce((sum, s) => sum + Number(s.scoreGiven), 0);
  const maxScore = criteriaList.reduce((sum, c) => sum + (c.maxScore || 0), 0);
  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const hasEmptyFeedback = scores.length > 0 && scores.some(s => !s.feedbackNotes || s.feedbackNotes.trim() === "");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!assignment || hasEmptyFeedback) return;

    try {
      setSubmitting(true);
      setSaveError(null);

      const payload = {
        projectId: assignment.id || assignment.submissionId,
        scores: scores
      };

      // console.log(payload);

      await submitScores(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setSaveError("Failed to save evaluation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!assignment) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
        <FaGavel className="mx-auto mb-3 text-slate-600" size={28} />
        <p className="text-slate-400">No project selected for evaluation.</p>
        <p className="text-xs text-slate-500 mt-1">Go back to your assigned queue and select a project.</p>
      </div>
    );
  }

  if (assignment.isEvaluated) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
        <FaGavel className="mx-auto mb-3 text-slate-600" size={28} />
        <p className="text-slate-400">This project has already been evaluated.</p>
        <p className="text-xs text-slate-500 mt-1">Your scores are locked and cannot be changed.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Judge"
        title="Evaluation"
        description="Score the assigned project using standardized criteria. Your score is confidential until results are published."
      />

      <Panel
        title={assignment.projectTitle || assignment.title || "Project"}
        description={`Team: ${assignment.teamName || "Unknown Team"}`}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              Score: <span className="font-bold text-white">{totalScore}/{maxScore}</span>
            </span>
            <span className={`text-sm font-bold ${scorePercent >= 70 ? "text-emerald-400" : scorePercent >= 40 ? "text-amber-400" : "text-red-400"}`}>
              {scorePercent}%
            </span>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Links */}
          {(assignment.githubRepoUrl || assignment.liveDemoUrl || assignment.youtubeUrl) && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assignment.githubRepoUrl && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-hidden">
                  <p className="text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider text-[10px]">Repository</p>
                  <a href={assignment.githubRepoUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline text-sm truncate block">
                    {assignment.githubRepoUrl}
                  </a>
                </div>
              )}
              {assignment.liveDemoUrl && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-hidden">
                  <p className="text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider text-[10px]">Live Demo</p>
                  <a href={assignment.liveDemoUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline text-sm truncate block">
                    {assignment.liveDemoUrl}
                  </a>
                </div>
              )}
              {assignment.youtubeUrl && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-hidden">
                  <p className="text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider text-[10px]">Video Pitch</p>
                  <a href={assignment.youtubeUrl} target="_blank" rel="noreferrer" className="text-red-400 hover:underline text-sm truncate block">
                    {assignment.youtubeUrl}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Rubric Criteria */}
          {loadingCriteria ? (
            <div className="py-10 text-center text-slate-400">Loading criteria...</div>
          ) : criteriaList.length === 0 ? (
            <div className="py-10 text-center text-slate-400">No evaluation criteria defined for this hackathon.</div>
          ) : (
            criteriaList.map((criteria) => {
              const scoreObj = scores.find((s) => s.criteriaId === criteria.id);
              const pct = Math.round(((scoreObj?.scoreGiven || 0) / criteria.maxScore) * 100);

              return (
                <div key={criteria.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <div className="mb-2">
                    <h3 className="font-bold text-white text-lg">{criteria.criteriaName}</h3>
                    <p className="mt-1 text-sm text-slate-400">{criteria.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={criteria.maxScore}
                        value={scoreObj?.scoreGiven || 0}
                        onChange={(e) => {
                          const val = Math.min(Math.max(Number(e.target.value), 0), criteria.maxScore);
                          updateScore(criteria.id, "scoreGiven", val);
                        }}
                        className={`w-24 rounded-xl bg-slate-950 px-2 py-3 text-center text-3xl font-extrabold shadow-inner outline-none transition focus:ring-2 focus:ring-sky-500/50 ${pct >= 70 ? "text-emerald-400" :
                          pct >= 40 ? "text-amber-400" :
                            "text-red-400"
                          }`}
                      />
                      <span className="text-xl font-bold text-slate-500">/ {criteria.maxScore}</span>
                    </div>

                    <div className="flex-1 w-full max-w-sm sm:ml-auto">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                        <span>Quick Adjust</span>
                        <span>{pct}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={criteria.maxScore}
                        value={scoreObj?.scoreGiven || 0}
                        onChange={(e) => updateScore(criteria.id, "scoreGiven", Number(e.target.value))}
                        className="w-full accent-slate-600 hover:accent-sky-400 transition-colors"
                      />
                      <div className="mt-1 flex justify-between text-[10px] text-slate-600 font-bold">
                        <span>0</span>
                        <span>{criteria.maxScore}</span>
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={scoreObj?.feedbackNotes || ""}
                    onChange={(e) => updateScore(criteria.id, "feedbackNotes", e.target.value)}
                    placeholder="Add a specific comment for this criterion..."
                    rows={2}
                    required
                    className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400 invalid:border-red-500/50"
                  />
                </div>
              );
            })
          )}

          {saveError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {saveError}
            </div>
          )}
          {saved && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              Evaluation saved successfully!
            </div>
          )}

          <Button className="w-full" disabled={submitting || criteriaList.length === 0 || hasEmptyFeedback}>
            {hasEmptyFeedback
              ? "Feedback notes required for all criteria"
              : submitting
                ? "Saving..."
                : `Save Evaluation (${totalScore}/${maxScore} pts)`}
          </Button>
        </form>
      </Panel>
    </>
  );
}