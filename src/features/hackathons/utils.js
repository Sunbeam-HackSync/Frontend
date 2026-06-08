// /src/features/hackathons/utils.js

import { useOutletContext } from "react-router";

import { useSelector } from "react-redux";

import useDemoData from "../../hooks/useDemoData";

import { useMemo } from "react";

export function useWorkspaceData() {
  const context = useOutletContext();
  const { state, commit } = useDemoData();
  const { user } = useSelector((reduxState) => reduxState.auth);
  const hackathon = context?.hackathon;
  const role = context?.role;

  const scoped = useMemo(() => {
    const registrations = state.registrations.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const teams = state.teams.filter((item) => item.hackathonId === hackathon?.id);
    const teamMembers = state.teamMembers.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const submissions = state.submissions.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const tickets = state.helpTickets.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const announcements = state.announcements.filter(
      (item) => item.hackathonId === hackathon?.id,
    );
    const rubrics = state.rubrics
      .filter((item) => item.hackathonId === hackathon?.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
      registrations,
      teams,
      teamMembers,
      submissions,
      tickets,
      announcements,
      rubrics,
    };
  }, [hackathon?.id, state]);

  function findUser(userId) {
    return state.users.find((item) => item.id === userId);
  }

  function findTeam(teamId) {
    return state.teams.find((item) => item.id === teamId);
  }

  return {
    ...context,
    state,
    commit,
    user,
    role,
    hackathon,
    ...scoped,
    findUser,
    findTeam,
  };
}