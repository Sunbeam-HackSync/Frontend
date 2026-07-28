import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FaTrophy, FaPlus, FaTrash } from "react-icons/fa";

import { getAllSubmissionsForSuperJudge, submitWinners, checkWinnersSubmitted } from "../../judge/services/judgeService";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Button from "../../../components/ui/Button";

export function JudgeSubmitWinnersPage() {
  const { id: hackathonId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Array of { submissionId, categoryName }
  const [winners, setWinners] = useState([{ submissionId: "", categoryName: "" }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true);
      try {
        const [data, submittedStatus] = await Promise.all([
          getAllSubmissionsForSuperJudge(hackathonId, search),
          checkWinnersSubmitted(hackathonId)
        ]);

        setSubmissions(Array.isArray(data) ? data : []);
        setAlreadySubmitted(submittedStatus);
      } catch {
        toast.error("Failed to load submissions for judging");
      } finally {
        setLoading(false);
      }
    }
    if (hackathonId) {
      loadSubmissions();
    }
  }, [hackathonId, search]);

  function addWinnerField() {
    setWinners([...winners, { submissionId: "", categoryName: "" }]);
  }

  function removeWinnerField(index) {
    const updated = [...winners];
    updated.splice(index, 1);
    setWinners(updated);
  }

  function updateWinner(index, field, value) {
    const updated = [...winners];
    updated[index][field] = value;
    setWinners(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Filter out invalid/empty entries
    const validWinners = winners.filter(w => w.submissionId && w.categoryName.trim() !== "");
    if (validWinners.length === 0) {
      toast.error("Please add at least one valid winner with a category");
      return;
    }

    try {
      setSubmitting(true);
      await submitWinners(hackathonId, validWinners);
      toast.success("Winners submitted successfully!");
      // Optionally navigate away
      navigate(`/workspace/${hackathonId}/overview`);
    } catch {
      toast.error("Failed to submit winners");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Super Judge"
        title="Submit Final Winners"
        description="Select the winning submissions and assign them categories (e.g., First Place, Best UI). Once submitted, the hackathon organizers can review the results."
      />

      <Panel title="Submissions Leaderboard" className="mb-8">
        {loading ? (
          <p className="text-slate-400">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-slate-400">No submissions found.</p>
        ) : (
          <div className="space-y-6">
            {submissions.map((subItem) => {
              const sub = subItem.submission;
              return (
                <div key={sub.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 backdrop-blur-sm transition-all hover:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white tracking-tight">{sub.projectTitle}</h3>
                      <p className="text-sm text-sky-400/80 font-medium mt-0.5">Team {sub.teamName}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-3xl font-black text-emerald-400 tabular-nums leading-none tracking-tight">{subItem.totalScore}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Total Score</div>
                    </div>
                  </div>

                  {subItem.evaluations && subItem.evaluations.length > 0 ? (
                    <div className="space-y-6 divide-y divide-slate-800/50">
                      {subItem.evaluations.map((evalObj, idx) => (
                        <div key={idx} className={idx === 0 ? "" : "pt-6"}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {evalObj.judgeEmail.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-slate-300">{evalObj.judgeEmail}</span>
                            </div>
                            <span className="text-sm font-bold text-sky-400 tabular-nums">{evalObj.judgeTotalScore} pts</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
                            {evalObj.scoreDetails.map((score, sIdx) => (
                              <div key={sIdx} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-400 font-medium truncate pr-4">{score.criteriaName}</span>
                                  <span className="font-bold text-slate-200 tabular-nums shrink-0">{score.scoreGiven}<span className="text-slate-600 font-normal">/{score.maxScore}</span></span>
                                </div>
                                {score.feedbackNotes && (
                                  <p className="text-[11px] text-slate-500/80 italic leading-relaxed line-clamp-2">"{score.feedbackNotes}"</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-amber-500/80 bg-amber-500/10 px-3 py-2 rounded-lg inline-block mt-2">Not evaluated yet</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel title="Assign Winners">
        {alreadySubmitted ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <h3 className="text-lg font-bold text-emerald-400 mb-2">Winners Already Declared!</h3>
            <p className="text-emerald-500/80">You have already submitted the final winners for this hackathon. This action cannot be undone.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {winners.map((winner, index) => (
              <div key={index} className="flex flex-col md:flex-row items-end gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950">

                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. First Place, Best Innovation"
                    value={winner.categoryName}
                    onChange={(e) => updateWinner(index, "categoryName", e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white focus:border-sky-500 outline-none"
                    required
                  />
                </div>

                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Winning Submission</label>
                  <select
                    value={winner.submissionId}
                    onChange={(e) => updateWinner(index, "submissionId", e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white focus:border-sky-500 outline-none"
                    required
                  >
                    <option value="">-- Select a Submission --</option>
                    {submissions.map((subItem) => (
                      <option key={subItem.submission.id} value={subItem.submission.id}>
                        {subItem.submission.projectTitle} (Team: {subItem.submission.teamName})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => removeWinnerField(index)}
                  disabled={winners.length === 1}
                  className="mb-1 p-2.5 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                  title="Remove"
                >
                  <FaTrash size={14} />
                </button>

              </div>
            ))}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={addWinnerField}
                className="flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <FaPlus size={12} /> Add Another Winner
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Button className="w-full md:w-auto" disabled={submitting || loading}>
                {submitting ? "Submitting..." : (
                  <span className="flex items-center gap-2">
                    <FaTrophy /> Submit Final Winners
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
      </Panel>
    </>
  );
}
