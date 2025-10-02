"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PlayerFormContainer } from "@/components/roster/PlayerFormContainer";


function AddPlayerPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  return (
    <PlayerFormContainer
      title="Add Player"
      backPath={`/dashboard/roster/${params.id}`}
      cancelPath={`/dashboard/roster/${params.id}`}
      submitText="Add Player"
      redirectPath={`/dashboard/roster/${params.id}`}
      getTeamId={() => params.id as string}
      getSeasonId={() => searchParams.get("season")}
      getDescription={(teamId, seasonId) => {
        if (teamId && seasonId) {
          return "Add a new player to your team roster for the current season";
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
