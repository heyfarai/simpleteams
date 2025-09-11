import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import type { Game, PaginatedGames } from "@/types/schema";
import { handleFetchError } from "@/lib/utils/errors";

interface GameFilters {
  season?: string;
  session?: string;
  division?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

const gameProjection = `{
  _id,
  gameNumber,
  gameDate,
  gameTime,
  status,
  "homeTeam": homeTeam->{
    _id,
    name,
    "logo": logo.asset->url
  },
  "awayTeam": awayTeam->{
    _id,
    name,
    "logo": logo.asset->url
  },
  score,
  "session": session->{
    _id,
    name,
    type,
    startDate
  },
  "season": season->{
    _id,
    name,
    year,
    isActive
  },
  venue,
  venueAddress
}`;

export async function fetchGames({
  season,
  session,
  division,
  status,
  page = 1,
  pageSize = 50,
}: GameFilters = {}): Promise<PaginatedGames> {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const filters = [
      '_type == "game"',
      season && `season._ref == "${season}"`,
      session && `coalesce(session._ref, "regular") == "${session}"`,
      status && `status == "${status}"`,
      division && `session->division._ref == "${division}"`,
    ]
      .filter(Boolean)
      .join(" && ");

    const query = groq`{
      "total": count(*[${filters}]),
      "games": *[${filters}] | order(gameDate desc) [${start}...${end}] ${gameProjection}
    }`;

    const result = await client.fetch<PaginatedGames>(query, { start, end });

    if (!result?.games) {
      console.error("Invalid Sanity response:", result);
      throw new Error("Invalid response from Sanity");
    }

    return result;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw handleFetchError(error);
  }
}

export async function fetchGameById(id: string): Promise<Game | null> {
  try {
    const query = groq`{
      "game": *[_type == "game" && _id == $id][0] ${gameProjection},
      "prev": *[_type == "game" && gameDate < ^.game.gameDate] | order(gameDate desc)[0] ${gameProjection},
      "next": *[_type == "game" && gameDate > ^.game.gameDate] | order(gameDate asc)[0] ${gameProjection}
    }`;

    const result = await client.fetch(query, { id });
    if (!result.game) return null;

    return {
      ...result.game,
      prev: result.prev || null,
      next: result.next || null,
    };
  } catch (error) {
    console.error("Error fetching game:", error);
    throw handleFetchError(error);
  }
}
