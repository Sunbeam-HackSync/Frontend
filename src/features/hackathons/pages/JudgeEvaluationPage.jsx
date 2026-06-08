// import { useWorkspaceData, saveScores } from "../utils";
import { useWorkspaceData } from "../utils";

import { saveScores } from "../../../services/demoStore";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";

import Badge from "../components/Badge";

import Button from "../../../components/ui/Button";

import { useState } from "react";

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