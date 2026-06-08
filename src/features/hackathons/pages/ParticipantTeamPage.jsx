import { useWorkspaceData } from "../utils";

import { useState } from "react";

import { createTeam } from "../../../services/demoStore";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";

import Badge from "../components/Badge";

import Button from "../../../components/ui/Button";


export function ParticipantTeamPage() {
  const { hackathon, teams, teamMembers, findUser, user, commit } = useWorkspaceData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const myMembership = teamMembers.find((member) => member.userId === user.id);
  const myTeam = teams.find((team) => team.id === myMembership?.teamId);

  function submitTeam(event) {
    event.preventDefault();
    if (!name.trim()) return;

    commit((draft) =>
      createTeam(draft, hackathon.id, user.id, name.trim(), description.trim()),
    );
    setName("");
    setDescription("");
  }

  return (
    <>
      <PageHeader
        eyebrow="Participant"
        title="Team Workspace"
        description="Create a team, share an invite code, and browse teams looking for teammates."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel title={myTeam ? "My Team" : "Create Team"}>
          {myTeam ? (
            <div>
              <Badge>{myTeam.status}</Badge>
              <h2 className="mt-4 text-2xl font-bold text-white">{myTeam.name}</h2>
              <p className="mt-2 text-slate-400">{myTeam.description}</p>
              <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-500">Invite Code</p>
                <p className="mt-1 text-xl font-bold text-sky-200">{myTeam.inviteCode}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submitTeam} className="space-y-4">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Team name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What are you building?"
                className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              />
              <Button className="w-full">Create Team</Button>
            </form>
          )}
        </Panel>

        <Panel title="Looking for Teammates">
          <div className="space-y-3">
            {teams.map((team) => {
              const members = teamMembers
                .filter((member) => member.teamId === team.id)
                .map((member) => findUser(member.userId));

              return (
                <div
                  key={team.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">{team.name}</h3>
                    <Badge>{team.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{team.description}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    Members: {members.map((member) => member?.fullName).join(", ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {team.lookingFor.map((skill) => (
                      <Badge key={skill} tone="blue">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </>
  );
}