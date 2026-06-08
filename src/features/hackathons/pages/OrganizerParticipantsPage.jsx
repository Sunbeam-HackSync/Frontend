import { useWorkspaceData } from "../utils";

import { updateRegistrationStatus } from "../../../services/demoStore";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";

import PersonRow from "../components/PersonRow";

import { formatDateTime } from "../../../utils/formatters";

import Badge from "../components/Badge";

import Button from "../../../components/ui/Button";


export function OrganizerParticipantsPage() {
  const { registrations, findUser, commit, user } = useWorkspaceData();

  function setRegistrationStatus(registrationId, status) {
    commit((draft) =>
      updateRegistrationStatus(
        draft,
        registrationId,
        status,
        user.id,
        status === "REJECTED" ? "Profile needs stronger project details." : "",
      ),
    );
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
          {registrations.map((registration) => {
            const applicant = findUser(registration.userId);

            return (
              <div
                key={registration.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <PersonRow
                  user={applicant}
                  helper={`Applied ${formatDateTime(registration.appliedAt)}`}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{registration.status}</Badge>
                  <Button
                    className="px-3"
                    onClick={() => setRegistrationStatus(registration.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    className="px-3"
                    variant="secondary"
                    onClick={() => setRegistrationStatus(registration.id, "WAITLISTED")}
                  >
                    Waitlist
                  </Button>
                  <Button
                    className="px-3"
                    variant="outline"
                    onClick={() => setRegistrationStatus(registration.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}