import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { getHackathonParticipants } from "../../host/services/hostService";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import PersonRow from "../components/PersonRow";
import Badge from "../components/Badge";
import Button from "../../../components/ui/Button";

export function OrganizerParticipantsPage() {
  const { id } = useParams();
  
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchParticipants() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getHackathonParticipants(id);
        // data should be an array of ParticipantResponseDTO
        setParticipants(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load participants.");
      } finally {
        setLoading(false);
      }
    }
    fetchParticipants();
  }, [id]);

  function setRegistrationStatus(registrationId, status) {
    // API endpoint for updating registration status is not explicitly provided in specs yet.
    // Assuming an endpoint like PUT /host/hackathon/{id}/participants/{participantId}/status
    // For now, updating local state
    setParticipants(prev => prev.map(p => 
      p.userId === registrationId ? { ...p, status } : p
    ));
    alert(`Status updated to ${status} (Local state only)`);
  }

  if (loading) {
    return <div className="py-10 text-slate-400">Loading participants...</div>;
  }

  if (error) {
    return <div className="py-10 text-red-400">{error}</div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Application Management"
        description="Review participant applications and move them through pending, approved, rejected, or waitlisted states."
      />

      <Panel title="Registrations">
        <div className="space-y-3">
          {participants.length === 0 ? (
            <p className="text-slate-400">No participants found.</p>
          ) : (
            participants.map((participant, index) => (
              <div
                key={participant.userId || `part-${index}`}
                className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <PersonRow
                  user={{ fullName: participant.fullName, email: participant.email, avatarUrl: null }}
                  helper={participant.teamName ? `Team: ${participant.teamName}` : "No team assigned"}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{participant.status || "PENDING"}</Badge>
                  <Button
                    className="px-3"
                    onClick={() => setRegistrationStatus(participant.userId, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    className="px-3"
                    variant="secondary"
                    onClick={() => setRegistrationStatus(participant.userId, "WAITLISTED")}
                  >
                    Waitlist
                  </Button>
                  <Button
                    className="px-3"
                    variant="outline"
                    onClick={() => setRegistrationStatus(participant.userId, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </>
  );
}