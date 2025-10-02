import { client } from "@/lib/sanity/client";
import type { GameRepository } from "../interfaces";
import type { Game } from "../../domain/models";
import { groq } from "next-sanity";

export class SanityGameRepository implements GameRepository {
  async findAll(): Promise<Game[]> {
    try {
      const query = groq`
        *[_type == "game"] | order(gameDate desc) {
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
        }
      `;

      const games = await client.fetch(query);
      const transformedGames = games.map(this.transformGame);
      return transformedGames;
    } catch (error) {
      console.error("Error fetching all games:", error);
      return [];
    }
  }

  async findById(id: string): Promise<Game | null> {
    try {
      const query = groq`
        *[_type == "game" && _id == $id][0] {
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
        }
      `;

      const game = await client.fetch(query, { id });
      return game ? this.transformGame(game) : null;
    } catch (error) {
      console.error("Error fetching game by ID:", error);
      return null;
    }
  }

  async findBySeason(seasonId: string): Promise<Game[]> {
    try {
      const query = groq`
        *[_type == "game" && season._ref == $seasonId] | order(gameDate desc) {
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
          venue,
          venueAddress
        }
      `;

      const games = await client.fetch(query, { seasonId });

      // Debug games data
      console.log('[GAMES DEBUG] Found', games.length, 'games for season:', seasonId);
      if (games.length > 0) {
        const gameWithScore = games.find(g => g.score);
        const gameWithoutScore = games.find(g => !g.score);

        if (gameWithScore) {
          console.log('[GAMES DEBUG] Sample game WITH score:', {
            id: gameWithScore._id,
            homeTeam: gameWithScore.homeTeam?.name,
            awayTeam: gameWithScore.awayTeam?.name,
            status: gameWithScore.status,
            score: gameWithScore.score
          });
        }

        if (gameWithoutScore) {
          console.log('[GAMES DEBUG] Sample game WITHOUT score:', {
            id: gameWithoutScore._id,
            homeTeam: gameWithoutScore.homeTeam?.name,
            awayTeam: gameWithoutScore.awayTeam?.name,
            status: gameWithoutScore.status,
            score: gameWithoutScore.score
          });
        }
      }

      const transformedGames = games.map(this.transformGame);

      if (transformedGames.length > 0) {
        const transformedWithScore = transformedGames.find(g => g.score);
        if (transformedWithScore) {
          console.log('[GAMES DEBUG] Sample TRANSFORMED game:', {
            id: transformedWithScore.id,
            homeTeam: transformedWithScore.homeTeam?.name,
            awayTeam: transformedWithScore.awayTeam?.name,
            status: transformedWithScore.status,
            homeScore: transformedWithScore.homeScore,
            awayScore: transformedWithScore.awayScore,
            score: transformedWithScore.score
          });
        }
      }

      return transformedGames;
    } catch (error) {
      console.error("Error fetching games by season:", error);
      return [];
    }
  }

  async findByTeam(teamId: string): Promise<Game[]> {
    try {
      const query = groq`
        *[_type == "game" && (homeTeam._ref == $teamId || awayTeam._ref == $teamId)] | order(gameDate desc) {
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
          venue,
          venueAddress
        }
      `;

      const games = await client.fetch(query, { teamId });
      return games.map(this.transformGame);
    } catch (error) {
      console.error("Error fetching games by team:", error);
      return [];
    }
  }

  async findByDivision(divisionId: string): Promise<Game[]> {
    try {
      const query = groq`
        *[_type == "game" && session->division._ref == $divisionId] | order(gameDate desc) {
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
          venue,
          venueAddress
        }
      `;

      const games = await client.fetch(query, { divisionId });
      return games.map(this.transformGame);
    } catch (error) {
      console.error("Error fetching games by division:", error);
      return [];
    }
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Game[]> {
    try {
      const query = groq`
        *[_type == "game" && gameDate >= $startDate && gameDate <= $endDate] | order(gameDate desc) {
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
          venue,
          venueAddress
        }
      `;

      const games = await client.fetch(query, { startDate, endDate });
      return games.map(this.transformGame);
    } catch (error) {
      console.error("Error fetching games by date range:", error);
      return [];
    }
  }

  async findUpcoming(limit = 10): Promise<Game[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const query = groq`
        *[_type == "game" && gameDate >= $today && status != "completed"] | order(gameDate asc) [0...$limit] {
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
          venue,
          venueAddress
        }
      `;

      const games = await client.fetch(query, { today, limit });
      return games.map(this.transformGame);
    } catch (error) {
      console.error("Error fetching upcoming games:", error);
      return [];
    }
  }

  async findCompleted(limit = 10): Promise<Game[]> {
    try {
      const query = groq`
        *[_type == "game" && status == "completed"] | order(gameDate desc) [0...$limit] {
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
          venue,
          venueAddress
        }
      `;

      const games = await client.fetch(query, { limit });
      return games.map(this.transformGame);
    } catch (error) {
      console.error("Error fetching completed games:", error);
      return [];
    }
  }

  private transformGame(sanityGame: any): Game {
    return {
      id: sanityGame._id,
      title: `${sanityGame.awayTeam?.name || 'TBD'} vs ${sanityGame.homeTeam?.name || 'TBD'}`,
      date: sanityGame.gameDate,
      time: sanityGame.gameTime || "TBD",
      venue: {
        id: "default",
        name: sanityGame.venue || "TBD",
        address: sanityGame.venueAddress || "",
        city: "",
        capacity: 0,
      },
      homeTeam: {
        id: sanityGame.homeTeam?._id || "",
        name: sanityGame.homeTeam?.name || "TBD",
        logo: sanityGame.homeTeam?.logo,
        status: "active",
      },
      awayTeam: {
        id: sanityGame.awayTeam?._id || "",
        name: sanityGame.awayTeam?.name || "TBD",
        logo: sanityGame.awayTeam?.logo,
        status: "active",
      },
      division: {
        id: "default",
        name: "TBD",
        ageGroup: "adult",
        conference: {
          id: "default",
          name: "Default",
          season: {
            id: sanityGame.season?._id || "",
            name: sanityGame.season?.name || "",
            year: sanityGame.season?.year || new Date().getFullYear(),
            status: "active",
          },
        },
      },
      season: {
        id: sanityGame.season?._id || "",
        name: sanityGame.season?.name || "",
        year: sanityGame.season?.year || new Date().getFullYear(),
        status: "active",
      },
      status: sanityGame.status || "scheduled",
      homeScore: sanityGame.score?.homeScore,
      awayScore: sanityGame.score?.awayScore,
      score: sanityGame.score && (sanityGame.score.homeScore !== undefined || sanityGame.score.awayScore !== undefined) ? {
        homeScore: sanityGame.score.homeScore || 0,
        awayScore: sanityGame.score.awayScore || 0,
      } : undefined,
    };
  }
}