import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import { createTeam, getTeams, getMyTeam } from "../services/workspaceService";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Badge from "../components/Badge";
import Button from "../../../components/ui/Button";

export function ParticipantTeamPage() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [myTeam, setMyTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        const [fetchedMyTeam, fetchedTeams] = await Promise.all([
          getMyTeam(id),
          getTeams(id)
        ]);
        setMyTeam(fetchedMyTeam);
        setTeams(fetchedTeams || []);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function submitTeam(event) {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      const newTeam = await createTeam({
        hackathonId: parseInt(id),
        teamName: name.trim(),
        skillsNeeded: description.trim(), // Storing description in skillsNeeded for now as per DTO
        leaderId: user?.id,
        lookingForMembers: true
      });
      
      setMyTeam(newTeam);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to create team", err);
      alert(err.message || "Failed to create team");
    }
  }

  if (loading) {
    return <div className="py-10 text-center text-slate-400">Loading team data...</div>;
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
              <Badge>{myTeam.status || "ACTIVE"}</Badge>
              <h2 className="mt-4 text-2xl font-bold text-white">{myTeam.teamName}</h2>
              <p className="mt-2 text-slate-400">{myTeam.skillsNeeded}</p>
              <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-500">Team ID</p>
                <p className="mt-1 text-xl font-bold text-sky-200">{myTeam.teamId}</p>
                <p className="mt-2 text-xs text-slate-500">Share this ID with teammates to join.</p>
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
                placeholder="What are you building? (Skills needed)"
                className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
              />
              <Button className="w-full">Create Team</Button>
            </form>
          )}
        </Panel>

        <Panel title="Looking for Teammates">
          <div className="space-y-3">
            {teams.length === 0 ? (
              <p className="text-slate-500 text-sm">No teams found or endpoint unavailable.</p>
            ) : (
              teams.map((team) => (
                <div
                  key={team.teamId}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">{team.teamName}</h3>
                    <Badge>{team.status || "OPEN"}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{team.skillsNeeded}</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="w-full text-xs">Request to Join</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}