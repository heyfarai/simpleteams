import { createClient as createSanityClient } from "@sanity/client";

const sanity = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-05-03",
  useCdn: false,
});

export async function createTeamInSanity(teamData: any) {
  const seasonId =
    process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID ||
    "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3";

  try {
    // Get season
    const season = await sanity.fetch(
      `*[_type == "season" && _id == $seasonId][0] { _id, name }`,
      { seasonId }
    );

    if (!season) {
      console.error("No active season found for ID:", seasonId);
      throw new Error("No active season found");
    }

    // Verify division exists
    if (!teamData.division_preference) {
      console.error("No division preference for team:", teamData.id);
      throw new Error("No division preference");
    }

    const division = await sanity.fetch(
      `*[_type == "division" && _id == $divisionId][0] { _id, name }`,
      { divisionId: teamData.division_preference }
    );

    if (!division) {
      console.error("Division not found:", teamData.division_preference);
      throw new Error("Division not found");
    }

    // Create team in Sanity with initial roster for the active season
    const sanityTeam = await sanity.create({
      _type: "team",
      name: teamData.name || teamData.team_name || "Team Name Required",
      shortName: generateShortName(teamData.name || teamData.team_name),
      location: {
        _key: `location-${Date.now()}`,
        city: teamData.city || "TBD",
        region: teamData.region || teamData.province || "",
      },
      colors: teamData.primary_color ? {
        _key: `colors-${Date.now()}`,
        primary: teamData.primary_color || "#1e40af",
        secondary: teamData.secondary_color || "#fbbf24",
        accent: teamData.accent_color || null,
      } : undefined,
      staff: buildStaffArray(teamData),
      stats: {
        _key: `stats-${Date.now()}`,
        wins: 0,
        losses: 0,
        ties: 0,
      },
      status: teamData.status || "active",
      rosters: [
        {
          _key: `roster-${Date.now()}`,
          season: {
            _type: "reference",
            _ref: seasonId,
          },
          players: [],
          seasonStats: {
            _key: `season-stats-${Date.now()}`,
            wins: 0,
            losses: 0,
            ties: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            homeRecord: "0-0",
            awayRecord: "0-0",
            conferenceRecord: "0-0",
          },
        },
      ],
      ...(teamData.id ? { supabaseTeamId: teamData.id } : {}),
    });

    console.log("Team created in Sanity:", sanityTeam);
    return sanityTeam;
  } catch (error) {
    console.error("Error creating team in Sanity:", error);
    throw error;
  }
}

export async function addTeamToDivision(
  seasonId: string,
  divisionId: string,
  teamId: string
) {
  try {
    // Get season with divisions
    const seasonWithDivisions = await sanity.fetch(
      `*[_type == "season" && _id == $seasonId][0] {
        _id,
        name,
        activeDivisions[] {
          _key,
          division->{_id},
          teams,
          status,
          teamLimits
        }
      }`,
      { seasonId }
    );

    if (!seasonWithDivisions) {
      throw new Error("Could not fetch season with divisions");
    }

    // Find the activeDivision that matches our division preference
    const targetActiveDivision = seasonWithDivisions.activeDivisions?.find(
      (ad: any) => ad.division._id === divisionId
    );

    if (!targetActiveDivision) {
      throw new Error(`Active division not found for division: ${divisionId}`);
    }

    // Add team reference to the activeDivision's teams array
    const newTeamRef = {
      _key: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      _type: "reference",
      _ref: teamId,
    };

    const updatedTeams = [...(targetActiveDivision.teams || []), newTeamRef];

    // Update the specific activeDivision by its _key
    await sanity
      .patch(seasonId)
      .set({
        [`activeDivisions[_key=="${targetActiveDivision._key}"].teams`]:
          updatedTeams,
      })
      .commit();

    console.log("Team added to division successfully:", {
      teamId,
      divisionKey: targetActiveDivision._key,
      divisionId,
    });
  } catch (error) {
    console.error("Failed to add team to division:", error);
    // Log for manual intervention but don't throw - team was created
    console.error(
      "Manual intervention required - Team created but not added to division:",
      {
        teamId,
        divisionId,
        seasonId,
      }
    );
  }
}

function generateShortName(teamName: string | undefined): string {
  if (!teamName) return "TBD";
  return teamName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .substring(0, 8);
}

function buildStaffArray(teamData: any) {
  const staff = [];

  // Add primary contact
  if (teamData.primary_contact_name) {
    staff.push({
      _key: `staff-${Date.now()}-1`,
      name: teamData.primary_contact_name,
      role: teamData.primary_contact_role || "manager",
      email: teamData.primary_contact_email,
      phone: teamData.primary_contact_phone,
    });
  }

  // Add head coach if provided
  if (teamData.head_coach_name) {
    staff.push({
      _key: `staff-${Date.now()}-2`,
      name: teamData.head_coach_name,
      role: "head-coach",
      email: teamData.head_coach_email,
      phone: teamData.head_coach_phone,
    });
  }

  return staff;
}