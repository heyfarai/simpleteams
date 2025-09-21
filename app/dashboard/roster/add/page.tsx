"use client";

import { useSearchParams } from "next/navigation";
import { PlayerFormContainer } from "@/components/roster/PlayerFormContainer";
import { useSelectedTeamInfo } from "@/components/dashboard/team-selector";


function AddPlayerPage() {
  const searchParams = useSearchParams();
  const selectedTeamInfo = useSelectedTeamInfo();

  return (
    <PlayerFormContainer
      title="Add Player"
      backPath="/dashboard/roster"
      cancelPath="/dashboard/roster"
      submitText="Add Player"
      redirectPath="/dashboard/roster"
      getTeamId={() => selectedTeamInfo?.sanityId}
      getSeasonId={() => searchParams.get("season")}
      getDescription={(teamId, seasonId) => {
        if (teamId && seasonId) {
          return "Add a new player to your selected team roster for the current season";
        }
        if (teamId) {
          return "Add a new player (season not specified)";
        }
        return "Please select a team first";
      }}
    />
  );
}

export default AddPlayerPage;
