import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/sanity/client";

interface Division {
  _id: string;
  name: string;
  teamLimits: {
    min: number;
    max: number;
  };
  teams: {
    _ref: string;
  }[];
}

interface ActiveDivision {
  division: Division;
  teamLimits: {
    min: number;
    max: number;
  };
  teams: {
    _ref: string;
  }[];
  status: "active" | "inactive";
}

export function useActiveDivisions() {
  return useQuery({
    queryKey: ["activeDivisions"],
    queryFn: async () => {
      const season = await client.fetch(
        `
        *[_type == "season" && _id == $seasonId][0] {
          _id,
          name,
          activeDivisions[] {
            _key,
            division->{_id, name, ageGroup},
            teamLimits,
            teams,
            status
          }
        }
      `,
        { seasonId: process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID! }
      );

      if (!season) {
        throw new Error("No active season found");
      }

      return season.activeDivisions.filter(
        (d: ActiveDivision) => d.status === "active"
      );
    },
  });
}
