import { useState } from "react";

import { useWorkspaceData } from "../utils";

import { createSubmission } from "../../../services/demoStore";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";

import Button from "../../../components/ui/Button";

import Badge from "../components/Badge";

import { formatDateTime } from "../../../utils/formatters";

import { isPast } from "../../../utils/formatters";


export function ParticipantSubmissionPage() {
  const { hackathon, submissions, teamMembers, teams, user, commit } = useWorkspaceData();
  const myMembership = teamMembers.find((member) => member.userId === user.id);
  const myTeam = teams.find((team) => team.id === myMembership?.teamId);
  const existingSubmission = submissions.find((item) => item.teamId === myTeam?.id);
  const [form, setForm] = useState({
    title: existingSubmission?.title || "",
    description: existingSubmission?.description || "",
    repositoryUrl: existingSubmission?.repositoryUrl || "",
    demoVideoUrl: existingSubmission?.demoVideoUrl || "",
    presentationUrl: existingSubmission?.presentationUrl || "",
    techStack: existingSubmission?.techStack?.join(", ") || "",
  });
  const closed = isPast(hackathon.submissionEnd);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitProject(event) {
    event.preventDefault();
    if (!myTeam || closed || !form.repositoryUrl.startsWith("https://")) return;

    commit((draft) => createSubmission(draft, hackathon.id, myTeam.id, form));
  }

  return (
    <>
      <PageHeader
        eyebrow="Participant"
        title="Submission Portal"
        description="Submit repository, demo video, deck, description, and tech stack before the deadline."
      />

      <Panel
        title={myTeam ? `Project for ${myTeam.name}` : "Create a team first"}
        description={`Deadline: ${formatDateTime(hackathon.submissionEnd)}`}
        actions={existingSubmission && <Badge>{existingSubmission.status}</Badge>}
      >
        <form onSubmit={submitProject} className="grid gap-4">
          {[
            ["title", "Project title"],
            ["repositoryUrl", "Repository URL https://..."],
            ["demoVideoUrl", "Demo video URL"],
            ["presentationUrl", "Presentation URL"],
            ["techStack", "Tech stack comma separated"],
          ].map(([field, placeholder]) => (
            <input
              key={field}
              value={form[field]}
              onChange={(event) => updateField(field, event.target.value)}
              placeholder={placeholder}
              disabled={!myTeam || closed}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
          ))}

          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Project description"
            disabled={!myTeam || closed}
            className="min-h-36 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <Button disabled={!myTeam || closed} className="w-full">
            {closed ? "Submission Closed" : existingSubmission ? "Update Submission" : "Submit Project"}
          </Button>
        </form>
      </Panel>
    </>
  );
}