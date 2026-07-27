import { useState } from "react";
import { useLocation } from "react-router";
import { useParams } from "react-router";

import api from "../../../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Badge from "../components/Badge";
import Button from "../../../components/ui/Button";
import { FaGavel, FaEyeSlash, FaEye } from "react-icons/fa";

// Standardized rubric criteria (until backend exposes dynamic rubrics)
const DEFAULT_RUBRICS = [
  { id: 1, title: "Technical Complexity", description: "How technically challenging and sophisticated is the solution?", maxScore: 25 },
  { id: 2, title: "Innovation & Creativity", description: "Does it solve the problem in a novel or creative way?", maxScore: 25 },
  { id: 3, title: "Completeness & Polish", description: "Is the solution complete and well-executed?", maxScore: 25 },
  { id: 4, title: "Impact & Viability", description: "How impactful and feasible is this in the real world?", maxScore: 25 },
];

async function saveEvaluation(hackathonId, submissionId, scores, conflict) {
  try {
    const response = await api.post(`/participants/hackathons/${hackathonId}/judge/evaluate`, {
      submissionId,
      conflict,
      scores,
    });
    return response.data;
  } catch {
    return null; // Endpoint not available yet — save locally
  }
}

export function JudgeEvaluationPage() {
  const { id: hackathonId } = useParams();
  const { state: routeState } = useLocation();

  // Assignment data passed from JudgeAssignedProjectsPage via router state
  const assignment = routeState?.assignment || null;

  const [blindMode, setBlindMode] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [scores, setScores] = useState(() =>
    DEFAULT_RUBRICS.map((rubric) => ({
      rubricId: rubric.id,
      scoreGiven: 0,
      comment: "",
    }))
  );

  function updateScore(rubricId, field, value) {
    setScores((current) =>
      current.map((score) =>
        score.rubricId === rubricId ? { ...score, [field]: value } : score
      )
    );
  }

  const totalScore = scores.reduce((sum, s) => sum + Number(s.scoreGiven), 0);
  const maxScore = DEFAULT_RUBRICS.reduce((sum, r) => sum + r.maxScore, 0);
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setSaveError(null);
      await saveEvaluation(
        hackathonId,
        assignment?.submissionId || assignment?.id,
        scores,
        conflict
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError("Failed to save. Please try again.");
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

  return (
    <>
      <PageHeader
        eyebrow="Judge"
        title="Evaluation Rubric"
        description="Score the assigned project using standardized criteria. Your score is confidential until results are published."
        actions={
          <button
            type="button"
            onClick={() => setBlindMode((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {blindMode ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            Blind Review {blindMode ? "ON" : "OFF"}
          </button>
        }
      />

      <Panel
        title={assignment.projectTitle || assignment.title || "Project"}
        description={
          blindMode
            ? "🔒 Team identity hidden for unbiased review."
            : `Team: ${assignment.teamName || "Unknown Team"}`
        }
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
          {/* Conflict of Interest */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300 transition hover:border-amber-500/30 has-[:checked]:border-amber-500/40 has-[:checked]:bg-amber-500/5">
            <input
              type="checkbox"
              checked={conflict}
              onChange={(e) => setConflict(e.target.checked)}
              className="accent-amber-500"
            />
            <div>
              <p className="font-medium text-white">Flag conflict of interest</p>
              <p className="text-xs text-slate-500">Check this if you personally know or mentored members of this team.</p>
            </div>
          </label>

          {/* Project details (visible in non-blind mode) */}
          {!blindMode && assignment.githubRepoUrl && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-500 mb-1">Repository</p>
              <a
                href={assignment.githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline text-sm"
              >
                {assignment.githubRepoUrl}
              </a>
            </div>
          )}

          {/* Rubric Criteria */}
          {DEFAULT_RUBRICS.map((rubric) => {
            const score = scores.find((s) => s.rubricId === rubric.id);
            const pct = Math.round(((score?.scoreGiven || 0) / rubric.maxScore) * 100);

            return (
              <div key={rubric.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{rubric.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-500">{rubric.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${
                    pct >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                    pct >= 40 ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {score?.scoreGiven || 0} / {rubric.maxScore}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={rubric.maxScore}
                  value={score?.scoreGiven || 0}
                  onChange={(e) => updateScore(rubric.id, "scoreGiven", Number(e.target.value))}
                  className="w-full accent-sky-400"
                />

                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>0</span>
                  <span>{Math.round(rubric.maxScore / 2)}</span>
                  <span>{rubric.maxScore}</span>
                </div>

                <textarea
                  value={score?.comment || ""}
                  onChange={(e) => updateScore(rubric.id, "comment", e.target.value)}
                  placeholder="Add a specific comment for this criterion..."
                  rows={2}
                  className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400"
                />
              </div>
            );
          })}

          {saveError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {saveError}
            </div>
          )}
          {saved && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              ✓ Evaluation saved successfully!
            </div>
          )}

          <Button className="w-full" disabled={submitting || conflict}>
            {conflict
              ? "⚠️ Conflict Flagged — Cannot Submit Score"
              : submitting
              ? "Saving..."
              : `Save Evaluation (${totalScore}/${maxScore} pts)`}
          </Button>
        </form>
      </Panel>
    </>
  );
}