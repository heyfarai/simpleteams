"use client";

import { useEffect, useState } from "react";
import { teamService } from "@/lib/services";
import { Team } from "@/lib/domain/models";
import Link from "next/link";
import { TeamLogo } from "@/components/team-logo";

export function LeagueTeamSpotlight() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeams() {
      try {
        const activeTeams = await teamService.getActiveTeams();
        const sortedTeams = activeTeams.sort((a, b) => a.name.localeCompare(b.name));
        const limitedTeams = sortedTeams.slice(0, 32);
        setTeams(limitedTeams);
        setError(null);
      } catch (err) {
        console.error("Failed to load teams:", err);
        setError("Failed to load teams");
      } finally {
        setIsLoading(false);
      }
    }

    loadTeams();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse text-center"
            >
              <div className="flex justify-center items-center size-12 bg-gray-200 rounded-full mx-auto" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto mt-48">
      <div className="text-center mb-24 space-y-4">
        <div className="heading-highlight-container">
          <h1 className="display-heading heading-highlight">Rep Your City.</h1>
        </div>
        <h2 className="text-xl md:text-2xl mt-4 leading-7">
          Champions Compete in the Capital.
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-8">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="text-center block transition-transform hover:scale-105 hover:opacity-80"
          >
            <div className="flex justify-center items-center mx-auto">
              <TeamLogo
                teamName={team.name}
                logoUrl={team.logo}
                size="md"
                className="rounded-full"
              />
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                {team.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
