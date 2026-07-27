import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useOutletContext } from "react-router";

import { submitProject, getMySubmission } from "../services/workspaceService";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Button from "../../../components/ui/Button";
import Badge from "../components/Badge";
import { formatDateTime } from "../../../utils/formatters";

const STATUS_BADGE = {
  DRAFT: "border-slate-600 text-slate-400",
  SUBMITTED: "border-emerald-500/30 text-emerald-400",
  DISQUALIFIED: "border-red-500/30 text-red-400",
};

export function ParticipantSubmissionPage() {
  const { id: hackathonId } = useParams();
  const { hackathon } = useOutletContext();

  const [existingSubmission, setExistingSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState({
    projectTitle: "",
    tagLine: "",
    description: "",
    githubRepoUrl: "",
    liveDemoUrl: "",
  });

  // Check if the submission deadline has passed
  const isDeadlinePast = hackathon?.submissionEnd
    ? new Date() > new Date(hackathon.submissionEnd)
    : false;

  useEffect(() => {
    async function fetchExisting() {
      try {
        setLoading(true);
        const data = await getMySubmission(hackathonId);
        if (data) {
          setExistingSubmission(data);
          setForm({
            projectTitle: data.projectTitle || "",
            tagLine: data.tagLine || "",
            description: data.description || "",
            githubRepoUrl: data.githubRepoUrl || "",
            liveDemoUrl: data.liveDemoUrl || "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    if (hackathonId) fetchExisting();
  }, [hackathonId]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isDeadlinePast) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload = {
        hackathonId: Number(hackathonId),
        projectTitle: form.projectTitle.trim(),
        tagLine: form.tagLine.trim(),
        description: form.description.trim(),
        githubRepoUrl: form.githubRepoUrl.trim(),
        liveDemoUrl: form.liveDemoUrl.trim(),
      };

      const result = await submitProject(payload);
      setExistingSubmission(result);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="py-10 text-slate-400">Loading submission...</div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Participant"
        title="Submission Portal"
        description="Submit your project repository, demo, and description before the deadline. Save as draft anytime."
      />

      {/* Deadline Banner */}
      {hackathon?.submissionEnd && (
        <div className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
          isDeadlinePast
            ? "border-red-500/30 bg-red-500/10 text-red-400"
            : "border-amber-500/30 bg-amber-500/10 text-amber-300"
        }`}>
          <span className="font-semibold">
            {isDeadlinePast ? "🔒 Submission Closed" : "⏰ Deadline:"}
          </span>
          <span>{formatDateTime(hackathon.submissionEnd)}</span>
        </div>
      )}

      <Panel
        title={existingSubmission ? `Project: ${existingSubmission.projectTitle}` : "Your Project Submission"}
        actions={
          existingSubmission && (
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_BADGE[existingSubmission.submissionStatus] || STATUS_BADGE.DRAFT}`}>
              {existingSubmission.submissionStatus}
            </span>
          )
        }
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Project Title */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Project Title *</label>
              <input
                value={form.projectTitle}
                onChange={(e) => updateField("projectTitle", e.target.value)}
                placeholder="e.g. MediTrack — AI-powered health monitor"
                disabled={isDeadlinePast}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Tagline */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Tagline</label>
              <input
                value={form.tagLine}
                onChange={(e) => updateField("tagLine", e.target.value)}
                placeholder="A short one-liner about your project"
                disabled={isDeadlinePast}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">GitHub Repository URL *</label>
              <input
                value={form.githubRepoUrl}
                onChange={(e) => updateField("githubRepoUrl", e.target.value)}
                placeholder="https://github.com/team/project"
                disabled={isDeadlinePast}
                required
                type="url"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Live Demo URL */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Live Demo URL</label>
              <input
                value={form.liveDemoUrl}
                onChange={(e) => updateField("liveDemoUrl", e.target.value)}
                placeholder="https://your-demo-link.vercel.app"
                disabled={isDeadlinePast}
                type="url"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Project Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Explain the problem you solved, how it works, your tech stack, and what makes it unique..."
              disabled={isDeadlinePast}
              rows={6}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              ✓ Submission saved successfully!
            </div>
          )}

          <Button
            disabled={isDeadlinePast || submitting}
            className="w-full"
          >
            {isDeadlinePast
              ? "🔒 Submission Closed"
              : submitting
              ? "Submitting..."
              : existingSubmission
              ? "Update Submission"
              : "Submit Project 🚀"
            }
          </Button>
        </form>
      </Panel>
    </>
  );
}